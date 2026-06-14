/**
 * EcoSphere - API Client Layer
 * Handles network transactions with the calculation and AI advisory endpoints.
 * Employs defensive try-catch handlers with safe fallback response structures.
 */

/**
 * Sends current telemetry values to backend calculation engine.
 * 
 * @param {Object} telemetry - Current consumer habits
 * @returns {Promise<Object>} Calculated metrics & environmental score
 */
export async function fetchCalculateMetrics(telemetry) {
  try {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telemetry),
    });

    if (!response.ok) {
      throw new Error(`Server calculations sync failed with HTTP status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[EcoSphere API] Defensive check triggered. Calculation error:', error.message);
    // Structured safe fallback
    return {
      cumulativeCarbon: 0,
      environmentalScore: 0,
      breakdown: {
        flights: 0,
        meat: 0,
        electricity: 0,
        trees: 0,
        transit: 0,
        vegan: 0,
        transport: 0,
        utilities: 0,
        dietAndFood: 0,
        offsets: 0
      }
    };
  }
}

/**
 * Sends telemetry and results to the AI Advisor endpoint to get recommendations.
 * 
 * @param {Object} telemetry - Current consumer habits
 * @param {Object} results - Calculated score and cumulative carbon values
 * @returns {Promise<Object>} Smart nudge recommendations
 */
export async function fetchSmartNudge(telemetry, results) {
  try {
    const response = await fetch('/api/nudge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...telemetry,
        cumulativeCarbon: results.cumulativeCarbon,
        environmentalScore: results.environmentalScore
      }),
    });

    if (!response.ok) {
      throw new Error(`Server smart nudge failed with HTTP status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[EcoSphere API] Defensive check triggered. AI nudge error:', error.message);
    // Structured safe fallback
    return {
      nudge: 'Reduce your carbon footprint by swapping vehicle trips for public transit or planting native vegetation.'
    };
  }
}
