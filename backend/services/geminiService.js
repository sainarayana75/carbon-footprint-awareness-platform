const { GoogleGenAI } = require('@google/generative-ai');

// High-fidelity local JSON mock array containing realistic Indian household metrics
const LOCAL_MOCK_NUDGES = [
  {
    category: 'flight',
    text: 'Booking a flight from Delhi to Mumbai generates approximately 90kg of CO2—equivalent to running a standard household refrigerator in Chennai for 5 months! Consider taking the train next time to reduce emissions by 85%.'
  },
  {
    category: 'diet',
    text: 'Eating a non-vegetarian meal generates around 2.5kg of CO2. Swapping just one chicken or lamb dish for a traditional Indian plant-based option (like Dal Tadka and rice) saves enough emissions to power a ceiling fan in Kolkata for 120 hours!'
  },
  {
    category: 'energy',
    text: 'Using 10 kWh of coal-heavy grid electricity in India produces about 8.2kg of CO2. Simple adjustments like running your AC at 26°C instead of 18°C in hot Delhi summers can reduce your monthly cooling bill and carbon footprint by up to 24%.'
  },
  {
    category: 'planting',
    text: 'Wonderful initiative! A single sapling planted in Indian soil can absorb about 20-22kg of CO2 annually as it matures. Over its lifetime, it will also help clean the local air and cool down city temperatures.'
  },
  {
    category: 'transit',
    text: 'Choosing public transit (like the Delhi Metro or Mumbai local trains) instead of a personal petrol vehicle reduces your travel emissions by over 80% per kilometer. You are actively clearing the city smog!'
  },
  {
    category: 'general',
    text: 'Your current EcoSphere score indicates ecological strain. Did you know that the average Indian household footprint is 1.8 tonnes of CO2 per year? Small actions like composting kitchen waste and air-drying clothes make a massive collective difference.'
  }
];

/**
 * Returns a high-fidelity local nudge tailored to the user's current telemetry
 * @param {Object} telemetry - Current telemetry metrics
 * @returns {string} - Tailored smart nudge
 */
function getLocalFallbackNudge(telemetry) {
  const score = telemetry.environmentalScore || 0;
  
  if (telemetry.flightCount > 0) {
    return LOCAL_MOCK_NUDGES.find(n => n.category === 'flight').text;
  }
  if (telemetry.meatMeals > 0) {
    return LOCAL_MOCK_NUDGES.find(n => n.category === 'diet').text;
  }
  if (telemetry.electricityUsage > 20) {
    return LOCAL_MOCK_NUDGES.find(n => n.category === 'energy').text;
  }
  if (telemetry.treePlantings > 0) {
    return LOCAL_MOCK_NUDGES.find(n => n.category === 'planting').text;
  }
  if (telemetry.publicTransit > 0) {
    return LOCAL_MOCK_NUDGES.find(n => n.category === 'transit').text;
  }
  if (score > 70) {
    return `Critical Alert: Your EcoSphere score is ${score} (Ecological Collapse). Carbon output is triggering heavy smog. Swapping to public transit and planting trees will immediately help clear the skies!`;
  }
  return LOCAL_MOCK_NUDGES.find(n => n.category === 'general').text;
}

/**
 * Fetches a creative, hyper-localized contextual smart nudge from Gemini 1.5 Flash.
 * If the API key is missing, or the call fails, or times out, it gracefully falls back.
 * @param {Object} telemetry - Current user telemetry
 * @returns {Promise<string>} - Contextual smart nudge
 */
async function generateSmartNudge(telemetry) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    // Graceful fallback if API key is not configured
    return getLocalFallbackNudge(telemetry);
  }

  // Create prompt with localized context guidelines
  const prompt = `
    You are EcoSphere AI, a sustainability coach helping people reduce their carbon footprint in India.
    Analyze the current telemetry data and generate a creative, hyper-localized, and highly engaging "Smart Nudge" (maximum 2-3 sentences).
    Use realistic Indian context, comparing the carbon footprints to relatable daily activities (e.g., ceiling fans, auto-rickshaws, metro rides, regional appliances, and local cities like Delhi, Mumbai, Bengaluru).
    
    Current Telemetry:
    - Flights (Delhi to Mumbai or similar): ${telemetry.flightCount || 0}
    - Meat Meals Eaten: ${telemetry.meatMeals || 0}
    - Electricity Usage: ${telemetry.electricityUsage || 0} kWh
    - Trees Planted (Offset): ${telemetry.treePlantings || 0}
    - Public Transit Trips (Offset): ${telemetry.publicTransit || 0}
    - Vegan/Vegetarian Meals: ${telemetry.veganMeals || 0}
    - Total Calculated Carbon Footprint: ${(telemetry.cumulativeCarbon || 0).toFixed(2)} kg CO2
    - Current EcoSphere Island Score (0 = Pristine Paradise, 100 = Ecological Collapse): ${telemetry.environmentalScore || 0}

    Guidelines for Output:
    - Focus on the most significant contributor or highlight positive steps.
    - Write with emotional awareness but stay constructive and motivating.
    - Keep it under 75 words.
    - Do not use markdown styling in the text. Return plain text only.
  `;

  try {
    // Timeout promise (5 seconds)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API call timed out')), 5000)
    );

    const apiCallPromise = (async () => {
      // Lazy init GoogleGenAI to ensure no errors on import
      const { GoogleGenAI } = require('@google/generative-ai');
      const ai = new GoogleGenAI({ apiKey });
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      
      const response = await result.response;
      const text = response.text();
      if (!text || text.trim() === '') {
        throw new Error('Empty response from Gemini API');
      }
      return text.trim();
    })();

    // Race the API call against the 5-second timeout
    const responseText = await Promise.race([apiCallPromise, timeoutPromise]);
    return responseText;
  } catch (error) {
    console.warn('Gemini Service Fallback triggered due to error:', error.message);
    return getLocalFallbackNudge(telemetry);
  }
}

module.exports = {
  generateSmartNudge,
  getLocalFallbackNudge,
  LOCAL_MOCK_NUDGES
};
