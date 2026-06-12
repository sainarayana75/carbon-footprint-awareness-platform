const request = require('supertest');
const app = require('../server');

// Mock @google/generative-ai SDK to ensure deterministic offline testing
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockImplementation(() => {
          return {
            generateContent: jest.fn().mockResolvedValue({
              response: {
                text: () => 'Mocked Gemini: Booking this flight generates 90kg of CO2—the equivalent of 4 months of household electricity in Delhi! Consider offsetting your ride.'
              }
            })
          };
        })
      };
    })
  };
});

describe('EcoSphere Backend API Suite', () => {
  beforeEach(() => {
    // Set environment variable for Gemini
    process.env.GEMINI_API_KEY = 'test-mock-key';
  });

  describe('POST /api/calculate', () => {
    it('should calculate correct carbon footprints and environmental score for clean inputs', async () => {
      const payload = {
        flightCount: 1, // 90 kg
        meatMeals: 2,   // 5 kg
        electricityUsage: 10, // 8.2 kg
        treePlantings: 1,    // -20 kg
        publicTransit: 2,    // -10 kg
        veganMeals: 2        // -4 kg
      };

      // Gross: 90 + 5 + 8.2 = 103.2 kg CO2
      // Offsets: 20 + 10 + 4 = 34 kg CO2
      // Net: 103.2 - 34 = 69.2 kg CO2
      // Score: Math.min(100, Math.max(0, Math.round((69.2 / 200) * 100))) = 35

      const res = await request(app)
        .post('/api/calculate')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('cumulativeCarbon');
      expect(res.body).toHaveProperty('environmentalScore');
      expect(res.body).toHaveProperty('breakdown');
      expect(res.body.cumulativeCarbon).toBeCloseTo(69.2, 1);
      expect(res.body.environmentalScore).toBe(35);
      expect(res.body.breakdown.flights).toBe(90);
      expect(res.body.breakdown.meat).toBe(5);
      expect(res.body.breakdown.electricity).toBeCloseTo(8.2, 1);
      expect(res.body.breakdown.trees).toBe(20);
      expect(res.body.breakdown.transit).toBe(10);
      expect(res.body.breakdown.vegan).toBe(4);
    });

    it('should fall back to zero net carbon and zero score when offsets exceed footprint', async () => {
      const payload = {
        flightCount: 0,
        meatMeals: 0,
        electricityUsage: 0,
        treePlantings: 10 // -200 kg CO2 offset
      };

      const res = await request(app)
        .post('/api/calculate')
        .send(payload)
        .expect(200);

      expect(res.body.cumulativeCarbon).toBe(0);
      expect(res.body.environmentalScore).toBe(0);
    });

    it('should reject negative values with a 400 Bad Request', async () => {
      const payload = {
        flightCount: -1,
        meatMeals: 2,
        electricityUsage: 10
      };

      const res = await request(app)
        .post('/api/calculate')
        .send(payload)
        .expect(400);

      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body).toHaveProperty('details');
      expect(res.body.details[0].msg).toContain('must be a non-negative integer');
    });

    it('should reject script injection or malicious inputs', async () => {
      const payload = {
        flightCount: '<script>alert("hack")</script>',
        meatMeals: 2
      };

      const res = await request(app)
        .post('/api/calculate')
        .send(payload)
        .expect(400);

      expect(res.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('POST /api/nudge', () => {
    it('should generate a custom nudge from mocked Gemini when key is present', async () => {
      const payload = {
        flightCount: 1,
        meatMeals: 2,
        electricityUsage: 10,
        cumulativeCarbon: 69.2,
        environmentalScore: 35
      };

      const res = await request(app)
        .post('/api/nudge')
        .send(payload)
        .expect(200);

      expect(res.body).toHaveProperty('nudge');
      expect(res.body.nudge).toContain('Mocked Gemini');
    });

    it('should fall back to local high-fidelity mock data array if GEMINI_API_KEY is empty', async () => {
      // Temporarily remove API key to trigger fallback
      delete process.env.GEMINI_API_KEY;

      const payload = {
        flightCount: 1,
        meatMeals: 0,
        electricityUsage: 0,
        cumulativeCarbon: 90.0,
        environmentalScore: 45
      };

      const res = await request(app)
        .post('/api/nudge')
        .send(payload)
        .expect(200);

      expect(res.body).toHaveProperty('nudge');
      expect(res.body.nudge).toContain('Delhi to Mumbai');
      expect(res.body.nudge).toContain('refrigerator');
    });

    it('should fall back to general local mock nudge if no telemetry triggers are active', async () => {
      delete process.env.GEMINI_API_KEY;

      const payload = {
        flightCount: 0,
        meatMeals: 0,
        electricityUsage: 0,
        cumulativeCarbon: 0,
        environmentalScore: 0
      };

      const res = await request(app)
        .post('/api/nudge')
        .send(payload)
        .expect(200);

      expect(res.body).toHaveProperty('nudge');
      expect(res.body.nudge).toContain('Indian household footprint');
    });
  });
});
