const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { generateSmartNudge } = require('../services/geminiService');

const router = express.Router();

// Rate limiter configuration to prevent brute-force evaluations and denial of service
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP. Please try again after a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all endpoints
router.use(apiLimiter);

/**
 * Carbon factors (kg CO2 per unit):
 * - Flight (Delhi-Mumbai one-way): 90 kg
 * - Meat Meal: 2.5 kg
 * - Electricity: 0.82 kg per kWh
 * - Trees Planted (offset): -20 kg
 * - Public Transit (offset): -5 kg
 * - Vegan Meal (offset): -2 kg
 */
const FACTORS = {
  flight: 90,
  meat: 2.5,
  electricity: 0.82,
  tree: 20,
  transit: 5,
  vegan: 2
};

// Validation rules for calculations & telemetry
const telemetryValidator = [
  body('flightCount')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Flight count must be a non-negative integer')
    .toInt(),
  body('meatMeals')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Meat meals must be a non-negative integer')
    .toInt(),
  body('electricityUsage')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Electricity usage must be a non-negative number')
    .toFloat(),
  body('treePlantings')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Tree plantings must be a non-negative integer')
    .toInt(),
  body('publicTransit')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Public transit trips must be a non-negative integer')
    .toInt(),
  body('veganMeals')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Vegan meals must be a non-negative integer')
    .toInt(),
  body('lpgCylinders')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 }).withMessage('LPG cylinders count must be a non-negative integer')
    .toInt(),
  body('carKm')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Car mileage must be a non-negative number')
    .toFloat(),
  body('fuelType')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['petrol', 'diesel', 'cng', 'ev']).withMessage('Invalid fuel type'),
  body('flightHours')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Flight hours must be a non-negative number')
    .toFloat(),
  body('foodWasteKg')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Food waste in kg must be a non-negative number')
    .toFloat(),
  body('compostWeeks')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Composting weeks must be a non-negative integer')
    .toInt()
];

// Helper to compute carbon metrics and environmental score
function calculateMetrics(data) {
  const flights = data.flightCount || 0;
  const flightHours = data.flightHours || 0;
  const meat = data.meatMeals || 0;
  const electricity = data.electricityUsage || 0;
  const trees = data.treePlantings || 0;
  const transit = data.publicTransit || 0;
  const vegan = data.veganMeals || 0;

  // New fields
  const lpg = data.lpgCylinders || 0;
  const carKm = data.carKm || 0;
  const fuelType = data.fuelType || 'petrol';
  const foodWaste = data.foodWasteKg || 0;
  const compost = data.compostWeeks || 0;

  // Car emission factor (kg CO2 per km)
  let carFactor = 0.18;
  if (fuelType === 'diesel') carFactor = 0.20;
  else if (fuelType === 'cng') carFactor = 0.12;
  else if (fuelType === 'ev') carFactor = 0.05;

  const grossCarbon = 
    (flights * FACTORS.flight) + 
    (flightHours * 90) + 
    (carKm * carFactor) + 
    (meat * FACTORS.meat) + 
    (foodWaste * 2.0) + 
    (electricity * FACTORS.electricity) + 
    (lpg * 42.5);

  const offsets = 
    (trees * FACTORS.tree) + 
    (transit * FACTORS.transit) + 
    (compost * 5.0) + 
    (vegan * FACTORS.vegan);
  
  // Calculate net carbon footprint, ensuring it doesn't go below 0
  const netCarbon = Math.max(0, grossCarbon - offsets);

  // Environmental Score computation:
  // Baseline threshold represents a healthy carbon cap of 200 kg CO2.
  // Beyond 200 kg, the ecosystem collapses to 100.
  const baselineThreshold = 200;
  const rawScore = (netCarbon / baselineThreshold) * 100;
  const environmentalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  return {
    cumulativeCarbon: netCarbon,
    environmentalScore,
    breakdown: {
      flights: (flights * FACTORS.flight) + (flightHours * 90) + (carKm * carFactor),
      meat: (meat * FACTORS.meat) + (foodWaste * 2.0),
      electricity: (electricity * FACTORS.electricity) + (lpg * 42.5),
      trees: trees * FACTORS.tree,
      transit: (transit * FACTORS.transit) + (compost * 5.0),
      vegan: vegan * FACTORS.vegan
    }
  };
}

/**
 * @route POST /api/calculate
 * @desc Calculate carbon footprint metrics & ecosystem score
 */
router.post(
  '/calculate',
  telemetryValidator,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    try {
      const results = calculateMetrics(req.body);
      return res.json(results);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to process carbon metrics' });
    }
  }
);

/**
 * @route POST /api/nudge
 * @desc Generate custom smart nudges utilizing Gemini 1.5 Flash or Mock Fallback
 */
router.post(
  '/nudge',
  [
    ...telemetryValidator,
    body('cumulativeCarbon')
      .optional()
      .isFloat({ min: 0 }).withMessage('Cumulative carbon must be a non-negative number')
      .toFloat(),
    body('environmentalScore')
      .optional()
      .isInt({ min: 0, max: 100 }).withMessage('Environmental score must be between 0 and 100')
      .toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    try {
      // Calculate metrics on the fly if cumulative/score are not provided
      const metrics = calculateMetrics(req.body);
      const telemetry = {
        flightCount: req.body.flightCount || 0,
        meatMeals: req.body.meatMeals || 0,
        electricityUsage: req.body.electricityUsage || 0,
        treePlantings: req.body.treePlantings || 0,
        publicTransit: req.body.publicTransit || 0,
        veganMeals: req.body.veganMeals || 0,
        cumulativeCarbon: req.body.cumulativeCarbon !== undefined ? req.body.cumulativeCarbon : metrics.cumulativeCarbon,
        environmentalScore: req.body.environmentalScore !== undefined ? req.body.environmentalScore : metrics.environmentalScore,
      };

      const nudge = await generateSmartNudge(telemetry);
      return res.json({ nudge });
    } catch (err) {
      // Return 200 with fallback nudge instead of 500 error to ensure the app never crashes
      const fallbackNudge = 'Your current carbon footprint tracker is active. Consider planting trees or taking public transit to restore the EcoSphere island!';
      return res.json({ nudge: fallbackNudge });
    }
  }
);

module.exports = router;
