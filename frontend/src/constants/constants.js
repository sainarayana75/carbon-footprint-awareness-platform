/**
 * EcoSphere - Constants Configuration
 * Establishes immutable emission factors, offset values, thresholds, and layout tabs.
 */

export const EMISSION_FACTORS = Object.freeze({
  flightOneWay: 90, // kg CO2 per flight (Delhi-Mumbai)
  flightHour: 90,   // kg CO2 per flight hour
  flightHourEstLedger: 15, // kg CO2 per flight hour estimation factor used in App ledger
  meatMeal: 2.5,    // kg CO2 per meat meal
  electricity: 0.82, // kg CO2 per kWh
  lpgCylinder: 42.5, // kg CO2 per LPG cylinder (backend calculation)
  lpgCylinderLedger: 45.0, // kg CO2 per LPG cylinder (ledger/UI display)
  foodWaste: 2.0,   // kg CO2 per kg food waste
  car: Object.freeze({
    petrol: 0.18,   // kg CO2 per km
    diesel: 0.20,
    cng: 0.12,
    ev: 0.05
  })
});

export const OFFSET_FACTORS = Object.freeze({
  treePlanted: 20.0, // kg CO2 offset per tree
  publicTransit: 5.0, // kg CO2 offset per trip
  veganMeal: 2.0,    // kg CO2 offset per vegan meal
  compostWeek: 5.0   // kg CO2 offset per week of composting
});

export const THRESHOLDS = Object.freeze({
  pristineMax: 30,
  collapsedMin: 70,
  dailyBudget: 5.0, // Indian household daily average (~5.0kg CO2 / day)
  baselineBudget: 200 // Threshold for environmental score calculation
});

export const DEFAULT_TELEMETRY = Object.freeze({
  carKm: 0,
  fuelType: 'petrol',
  flightHours: 0,
  publicTransit: 0,
  electricityUsage: 0,
  lpgCylinders: 0,
  meatMeals: 0,
  veganMeals: 0,
  foodWasteKg: 0,
  treePlantings: 0,
  compostWeeks: 0
});

export const TABS = Object.freeze([
  { id: 'transport', label: '🚗 Transport' },
  { id: 'utilities', label: '🏠 Utilities' },
  { id: 'diet', label: '🍽️ Diet & Food' },
  { id: 'offsets', label: '🌱 Offsets' }
]);

export const ECOSYSTEM_STATES = Object.freeze({
  pristine: Object.freeze({
    key: 'pristine',
    title: 'Pristine Paradise',
    description: 'EcoSphere is thriving. Clean air, lush green forests, clear waters, and solar energy are dominant.',
    themeClass: 'from-emerald-950/40 via-teal-900/30 to-emerald-950/20',
    badgeColor: 'bg-emerald-400'
  }),
  strained: Object.freeze({
    key: 'strained',
    title: 'Strained Biosphere',
    description: 'Warning: The ecosystem is losing balance. Trees are fading, and grey clouds are blocking out the sun.',
    themeClass: 'from-amber-950/30 via-stone-900/40 to-stone-950',
    badgeColor: 'bg-amber-400'
  }),
  collapsed: Object.freeze({
    key: 'collapsed',
    title: 'Ecological Collapse',
    description: 'Critical! Industrial smog, thick soot, flashing alerts, and active smokestacks are choking the island.',
    themeClass: 'from-stone-900 via-neutral-950 to-zinc-950',
    badgeColor: 'bg-red-500 animate-pulse'
  })
});
