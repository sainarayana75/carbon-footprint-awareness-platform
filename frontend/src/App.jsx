import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sun,
  Trees,
  Waves,
  Cloud,
  Factory,
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
  Leaf,
  Zap,
  Car,
  Utensils,
  Plane,
  RotateCcw,
  BookOpen,
  History,
  Home,
  Flame,
  Trash2
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function App() {
  // Active Input Tab Tracker State
  const [activeTab, setActiveTab] = useState('transport');

  // 1. Comprehensive Telemetry State tracking 10 granular consumer habits
  const [telemetry, setTelemetry] = useState({
    // Transport Tab
    carKm: 0,
    fuelType: 'petrol', // choices: 'petrol', 'diesel', 'cng', 'ev'
    flightHours: 0,
    publicTransit: 0,
    // Utilities Tab
    electricityUsage: 0,
    lpgCylinders: 0,
    // Diet & Food Tab
    meatMeals: 0,
    veganMeals: 0,
    foodWasteKg: 0,
    // Offsets Tab
    treePlantings: 0,
    compostWeeks: 0
  });

  // 2. Calculated Carbon & Score Metrics State
  const [results, setResults] = useState({
    cumulativeCarbon: 0,
    environmentalScore: 0,
    breakdown: {
      transport: 0,
      utilities: 0,
      dietAndFood: 0,
      offsets: 0
    }
  });

  // 3. Gemini Smart Nudge State
  const [nudge, setNudge] = useState('');
  const [nudgeLoading, setNudgeLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // 3b. Environmental Impact Ledger State
  const [ledger, setLedger] = useState([
    {
      id: 'init',
      timestamp: new Date().toLocaleTimeString(),
      action: 'EcoSphere Initialized',
      impact: '0.0kg CO₂',
      consequence: 'Tactical carbon war room active. Pristine status initialized.'
    }
  ]);

  // 4. Threshold coefficients configuration to prevent unnecessary virtual DOM calculations
  const thresholds = useMemo(() => ({
    pristineMax: 30,
    collapsedMin: 70
  }), []);

  // Compute current ecosystem visual state based on total score
  const ecosystemState = useMemo(() => {
    const score = results.environmentalScore;
    if (score < thresholds.pristineMax) {
      return {
        key: 'pristine',
        title: 'Pristine Paradise',
        description: 'EcoSphere is thriving. Clean air, lush green forests, clear waters, and solar energy are dominant.',
        themeClass: 'from-emerald-950/40 via-teal-900/30 to-emerald-950/20',
        badgeColor: 'bg-emerald-400'
      };
    } else if (score > thresholds.collapsedMin) {
      return {
        key: 'collapsed',
        title: 'Ecological Collapse',
        description: 'Critical! Industrial smog, thick soot, flashing alerts, and active smokestacks are choking the island.',
        themeClass: 'from-stone-900 via-neutral-950 to-zinc-950',
        badgeColor: 'bg-red-500 animate-pulse'
      };
    } else {
      return {
        key: 'strained',
        title: 'Strained Biosphere',
        description: 'Warning: The ecosystem is losing balance. Trees are fading, and grey clouds are blocking out the sun.',
        themeClass: 'from-amber-950/30 via-stone-900/40 to-stone-950',
        badgeColor: 'bg-amber-400'
      };
    }
  }, [results.environmentalScore, thresholds]);

  // Carbon budget calculations vs Indian household daily average (~5.0kg CO₂ / day)
  const budgetData = useMemo(() => {
    const dailyBudget = 5.0;
    const netFootprint = results.cumulativeCarbon;
    const percentage = Math.min(100, Math.round((netFootprint / dailyBudget) * 100));
    const isOver = netFootprint > dailyBudget;
    return { dailyBudget, percentage, isOver };
  }, [results.cumulativeCarbon]);

  // Real-time chart metric dataset matching platform theme variables
  const chartData = useMemo(() => {
    const breakdown = results.breakdown || { transport: 0, utilities: 0, dietAndFood: 0 };
    return [
      { name: 'Transport', value: breakdown.transport || 0, color: '#3b82f6' }, // blue-500
      { name: 'Utilities', value: breakdown.utilities || 0, color: '#eab308' }, // yellow-500
      { name: 'Diet & Food', value: breakdown.dietAndFood || 0, color: '#ef4444' } // red-500
    ].filter(item => item.value > 0);
  }, [results.breakdown]);

  // 5. Backend calculation API interaction pipeline
  const fetchMetrics = async (currentTelemetry) => {
    try {
      setApiError(null);
      const calcRes = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTelemetry)
      });

      if (!calcRes.ok) throw new Error('Server metrics sync error');
      const calcData = await calcRes.json();
      setResults(calcData);
      fetchNudge(currentTelemetry, calcData);
    } catch (err) {
      console.error(err);
      setApiError('Unable to update metrics. Check fallback routes or backend connection.');
    }
  };

  const fetchNudge = async (currentTelemetry, calculatedMetrics) => {
    // CRUCIAL SAFETY: Short-circuit optimization check on initialization to minimize network token consumption
    if (calculatedMetrics.environmentalScore === 0) {
      setNudge('Welcome to EcoSphere! Your island is in perfect harmony. Log your daily actions on the right to see how your carbon choices dynamically alter your ecosystem.');
      setNudgeLoading(false);
      return;
    }

    setNudgeLoading(true);
    try {
      const nudgeRes = await fetch('/api/nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentTelemetry,
          cumulativeCarbon: calculatedMetrics.cumulativeCarbon,
          environmentalScore: calculatedMetrics.environmentalScore
        })
      });

      if (!nudgeRes.ok) throw new Error('AI analysis processing route error');
      const nudgeData = await nudgeRes.json();
      setNudge(nudgeData.nudge);
    } catch (err) {
      console.error('Nudge fetch error, falling back:', err);
      setNudge('Reduce your carbon footprint by swapping vehicle trips for public transit or planting native vegetation.');
    } finally {
      setNudgeLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(telemetry);
  }, []);

  // 6. Optimized callback telemetry state mutation wrapper
  const handleModifyTelemetry = useCallback((key, valueOrDelta, isDirectAssignment = false) => {
    setTelemetry(prev => {
      const updated = {
        ...prev,
        [key]: isDirectAssignment
          ? (typeof valueOrDelta === 'number' ? Math.max(0, valueOrDelta) : valueOrDelta)
          : Math.max(0, prev[key] + valueOrDelta)
      };

      const hasChanged = updated[key] !== prev[key];
      if (hasChanged) {
        const timestamp = new Date().toLocaleTimeString();
        let actionName = '';
        let impactValue = '';
        let consequenceText = '';

        // Ledger text generation logic mapping for all 10 inputs
        if (key === 'carKm' || key === 'fuelType') {
          actionName = `Adjusted Car Travel to ${updated.carKm} km (${updated.fuelType.toUpperCase()})`;
          impactValue = updated.carKm > prev.carKm ? 'Emissions Up' : 'Recalibrated';
          consequenceText = updated.fuelType === 'ev' ? 'Low-emissions power grid load profile applied' : 'Petroleum exhaust track initialized';
        } else if (key === 'flightHours') {
          actionName = `Set Aviation Time to ${updated.flightHours} Hours`;
          impactValue = updated.flightHours > prev.flightHours ? `+${(updated.flightHours * 15).toFixed(0)}kg Est.` : 'Reduced Airtime';
          consequenceText = 'High-altitude emissions loaded into upper atmospheric layer';
        } else if (key === 'publicTransit') {
          actionName = updated.publicTransit > prev.publicTransit ? 'Added Public Transit Commute' : 'Removed Public Transit Entry';
          impactValue = updated.publicTransit > prev.publicTransit ? '-5.0kg CO₂' : 'Offset Adjusted';
          consequenceText = 'Mass transit efficiency credit assigned to footprint profile';
        } else if (key === 'electricityUsage') {
          actionName = `Set Household Grid Power to ${updated.electricityUsage} kWh`;
          impactValue = updated.electricityUsage > prev.electricityUsage ? 'Grid Pull Increased' : 'Power Conserved';
          consequenceText = 'Thermal plant coal generation profile updated';
        } else if (key === 'lpgCylinders') {
          actionName = updated.lpgCylinders > prev.lpgCylinders ? 'Logged LPG Cooking Gas Cylinder' : 'Removed Cooking Cylinder Log';
          impactValue = updated.lpgCylinders > prev.lpgCylinders ? '+45.0kg CO₂' : 'Gas Log Cleared';
          consequenceText = 'Concentrated hydrocarbon combustion metric added';
        } else if (key === 'meatMeals') {
          actionName = updated.meatMeals > prev.meatMeals ? 'Logged Ruminant Meat Meal' : 'Removed Meat Meal Entry';
          impactValue = updated.meatMeals > prev.meatMeals ? '+2.5kg CO₂' : 'Diet Reverted';
          consequenceText = 'High-impact agricultural methane emissions tallied';
        } else if (key === 'veganMeals') {
          actionName = updated.veganMeals > prev.veganMeals ? 'Logged Vegan/Veggie Plant Meal' : 'Removed Vegan Meal entry';
          impactValue = updated.veganMeals > prev.veganMeals ? '-2.0kg CO₂' : 'Diet Adjusted';
          consequenceText = 'Sustainable low-intensity food alternative tracked';
        } else if (key === 'foodWasteKg') {
          actionName = `Logged ${updated.foodWasteKg} kg Kitchen Food Waste`;
          impactValue = updated.foodWasteKg > prev.foodWasteKg ? 'Waste Metric Up' : 'Waste Reduced';
          consequenceText = 'Anaerobic landfill decomposition decay profile simulation active';
        } else if (key === 'treePlantings') {
          actionName = updated.treePlantings > prev.treePlantings ? 'Planted Carbon Sequestration Tree' : 'Removed Seedling Log';
          impactValue = updated.treePlantings > prev.treePlantings ? '-20.0kg CO₂' : 'Biomass Adjusted';
          consequenceText = 'Long-term biological carbon capture layer expanded';
        } else if (key === 'compostWeeks') {
          actionName = `Logged ${updated.compostWeeks} Weeks Organic Waste Composting`;
          impactValue = updated.compostWeeks > prev.compostWeeks ? 'Methane Avoided' : 'Compost Reverted';
          consequenceText = 'Aerobic waste management loop engaged';
        }

        setLedger(ledgerPrev => [
          { id: `${Date.now()}-${Math.random()}`, timestamp, action: actionName, impact: impactValue, consequence: consequenceText },
          ...ledgerPrev
        ]);
      }

      fetchMetrics(updated);
      return updated;
    });
  }, []);

  const handleReset = useCallback(() => {
    const emptyTelemetry = {
      carKm: 0, fuelType: 'petrol', flightHours: 0, publicTransit: 0,
      electricityUsage: 0, lpgCylinders: 0,
      meatMeals: 0, veganMeals: 0, foodWasteKg: 0,
      treePlantings: 0, compostWeeks: 0
    };
    setTelemetry(emptyTelemetry);
    setLedger([{
      id: 'reset',
      timestamp: new Date().toLocaleTimeString(),
      action: 'EcoSphere Reset Complete',
      impact: '0.0kg CO₂',
      consequence: 'Telemetry wiped clean. Pristine balance recovered.'
    }]);
    fetchMetrics(emptyTelemetry);
  }, []);

  // ADD THIS MISSING FUNCTION HERE TO REMOVE THE REFERENCE ERROR:
  const handleRefreshNudge = useCallback(() => {
    fetchNudge(telemetry, results);
  }, [telemetry, results]);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans antialiased">
      {/* APP HEADER */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">EcoSphere</h1>
            <p className="text-xs text-slate-400 font-medium">Advanced Carbon Tactical Room & Awareness Platform</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-2 text-xs font-bold px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-850 text-slate-300 transition duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Reset telemetry and metrics matrix"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Platform</span>
        </button>
      </header>

      {/* DASHBOARD CORE SCREEN LAYOUT */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full">

        {/* LEFT COMPONENT COLUMN: ECOSYSTEM INFRASTRUCTURE SIMULATOR */}
        <section aria-label="EcoSphere Canvas" className="lg:col-span-5 flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-900 bg-slate-900/40 backdrop-blur-md p-6 relative min-h-[520px]">
          <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 opacity-90 ${ecosystemState.themeClass}`} />

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-6">
            <div className="absolute top-0 right-0 bg-slate-900/95 border border-slate-800 rounded-full px-4 py-1.5 flex items-center space-x-2 shadow-xl">
              <span className={`w-2.5 h-2.5 rounded-full ${ecosystemState.badgeColor}`} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-200">{ecosystemState.title}</span>
            </div>

            {/* Simulated Ecosystem Map Graphics */}
            <div className="relative w-64 h-64 flex items-center justify-center mt-4">
              <div className="absolute top-2 w-full flex justify-between px-6">
                {results.environmentalScore <= thresholds.collapsedMin ? (
                  <Sun className={`w-12 h-12 text-amber-400 animate-spin-slow transition-all duration-1000 ${results.environmentalScore > thresholds.pristineMax ? 'opacity-40 scale-75 text-amber-600' : 'scale-100'}`} />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-red-500 animate-bounce" />
                )}
                <div className="flex space-x-2">
                  <Cloud className={`w-8 h-8 text-slate-400 transition-all duration-1000 ${results.environmentalScore < thresholds.pristineMax ? 'opacity-10 scale-50' : 'opacity-80'}`} />
                  <Cloud className={`w-10 h-10 text-slate-500 transition-all duration-1000 ${results.environmentalScore < thresholds.pristineMax ? 'opacity-0 scale-30' : 'opacity-90 animate-pulse'}`} />
                </div>
              </div>

              {/* 2D Central Island Visual State Base */}
              <div className={`w-52 h-52 rounded-full transition-all duration-1000 relative flex items-center justify-center overflow-hidden border ${results.environmentalScore < thresholds.pristineMax
                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_50px_rgba(16,185,129,0.25)] border-emerald-300/20'
                : results.environmentalScore > thresholds.collapsedMin
                  ? 'bg-gradient-to-br from-stone-800 to-zinc-950 shadow-[0_0_40px_rgba(239,68,68,0.1)] border-red-500/20'
                  : 'bg-gradient-to-br from-amber-500 to-stone-600 shadow-[0_0_30px_rgba(245,158,11,0.15)] border-amber-400/20'
                }`}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M-5,50 C25,35 75,65 105,50" fill="none" stroke={results.environmentalScore < thresholds.pristineMax ? '#0284c7' : results.environmentalScore > thresholds.collapsedMin ? '#451a03' : '#d97706'} strokeWidth="8" className="transition-colors duration-1000" />
                </svg>

                <div className="relative z-10 w-full h-full flex flex-col justify-between p-6">
                  <div className="flex justify-around items-center h-14 mt-2">
                    <Trees className={`w-8 h-8 transition-all duration-1000 ${results.environmentalScore < thresholds.pristineMax ? 'text-teal-950 scale-110' : results.environmentalScore > thresholds.collapsedMin ? 'text-stone-900 opacity-10 scale-50' : 'text-stone-700'}`} />
                    <Trees className={`w-10 h-10 transition-all duration-1000 ${results.environmentalScore < thresholds.pristineMax ? 'text-emerald-950 scale-120 animate-pulse' : results.environmentalScore > thresholds.collapsedMin ? 'text-stone-900 opacity-5 scale-40' : 'text-stone-800'}`} />
                  </div>

                  <div className="flex justify-center items-center h-14 mb-2">
                    {results.environmentalScore > thresholds.collapsedMin ? (
                      <div className="flex space-x-4 relative">
                        <Factory className="w-10 h-10 text-stone-400 animate-bounce" />
                        <Factory className="w-8 h-8 text-stone-500" />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-emerald-950 opacity-40">
                        <Waves className="w-5 h-5 animate-pulse" />
                        <span className="text-[9px] font-black tracking-widest">STABLE BIOME</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* METRICS CORE TELEMETRY SLIDER SECTION */}
          <div className="relative z-10 bg-slate-950/80 border border-slate-900/60 rounded-2xl p-5 backdrop-blur-md space-y-4 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ecosystem Health Penalty</span>
                <div className="flex items-baseline space-x-2">
                  <div id="environmental-score-display" aria-live="polite" className="text-3xl font-black font-mono tracking-tight text-white">
                    {results.environmentalScore}
                    <span className="text-xs text-slate-500 font-semibold ml-0.5">/100</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium font-mono">({results.cumulativeCarbon.toFixed(1)} kg CO₂ Net)</div>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-1000 rounded-full ${results.environmentalScore < thresholds.pristineMax
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : results.environmentalScore > thresholds.collapsedMin
                        ? 'bg-gradient-to-r from-red-600 to-orange-500'
                        : 'bg-gradient-to-r from-amber-500 to-amber-300'
                      }`}
                    style={{ width: `${results.environmentalScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">{ecosystemState.description}</p>
              </div>

              {/* Circular Carbon Budget Ring Dashboard Display */}
              <div className="md:col-span-4 flex justify-center border-t border-slate-900 md:border-t-0 pt-3 md:pt-0">
                <div className="flex flex-col items-center justify-center p-3 bg-slate-900/40 rounded-xl border border-slate-850 w-full max-w-[120px]">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50" cy="50" r="40"
                        stroke={budgetData.isOver ? '#ef4444' : '#10b981'}
                        strokeWidth="8" fill="transparent"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - budgetData.percentage / 100)}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute text-center flex flex-col">
                      <span className="text-[10px] font-black font-mono">{budgetData.percentage}%</span>
                      <span className="text-[6px] text-slate-500 font-bold uppercase">Budget</span>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded block text-center mt-2 border ${budgetData.isOver ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>{budgetData.isOver ? 'Deficit' : 'Safe zone'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL COMPONENT COLUMN: CONTROLS & MANAGEMENT WAR ROOM */}
        <section role="region" aria-label="Contextual Tracker" className="lg:col-span-7 flex flex-col space-y-6">
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between" role="alert">
              <span>{apiError}</span>
              <button onClick={() => fetchMetrics(telemetry)} className="font-bold underline tracking-wide">Sync</button>
            </div>
          )}

          {/* AI Advisor Card Container */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full filter blur-xl" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Gemini Strategic Advisory</h3>
              </div>
              <button
                onClick={handleRefreshNudge} disabled={nudgeLoading} aria-label="Refresh smart nudge recommendations"
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 transition duration-100 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${nudgeLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="min-h-[50px] flex items-center">
              {nudgeLoading ? (
                <div className="space-y-2 w-full animate-pulse"><div className="h-3 bg-slate-850 rounded w-3/4" /><div className="h-3 bg-slate-850 rounded w-5/6" /></div>
              ) : (
                <p className="text-xs text-slate-200 italic leading-relaxed font-medium">"{nudge || 'Adjust data trackers below to activate AI tactical recommendation logs.'}"</p>
              )}
            </div>
          </div>

          {/* CATEGORICAL RADIAL METRIC DATA MATRIX MAP (RECHARTS) */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Emission Footprint Composition Matrix</h3>
            </div>
            {chartData.length === 0 ? (
              <div className="h-32 flex items-center justify-center bg-slate-950 border border-slate-900 border-dashed rounded-2xl">
                <p className="text-xs text-slate-500 italic">Ecosystem pristine. Distribution metrics empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-950 border border-slate-900/80 p-4 rounded-2xl">
                <div className="md:col-span-6 h-32 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={42} outerRadius={55} paddingAngle={4} dataKey="value">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '10px', color: '#f8fafc', fontSize: '11px' }} formatter={(val) => [`${val.toFixed(1)} kg CO₂`, 'Impact']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="md:col-span-6 space-y-1.5">
                  {chartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-[11px] border-b border-slate-900 pb-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-slate-400">{item.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-200">{item.value.toFixed(1)} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TACTICAL INPUT GRID BOX & TABBED CONTAINER LAYER */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-5 backdrop-blur-md flex flex-col">

            {/* UI Tab Control Selector List Bar */}
            <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-900 mb-5 overflow-x-auto">
              {[
                { id: 'transport', label: '🚗 Transport', icon: Car },
                { id: 'utilities', label: '🏠 Utilities', icon: Home },
                { id: 'diet', label: '🍽️ Diet & Food', icon: Utensils },
                { id: 'offsets', label: '🌱 Offsets', icon: Leaf }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 text-xs font-black px-3 py-2 rounded-lg whitespace-nowrap transition duration-150 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${isActive ? 'bg-slate-900 border border-slate-800 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB INTERACTIVE CONTROL INTERFACES */}
            <div className="min-h-[220px]">

              {/* INTERFACE A: TRANSPORT COMPONENT SUB PANEL */}
              <div className={activeTab === 'transport' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'hidden'}>
                {/* Advanced Car Mileage Input Component */}
                <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center space-x-2.5 mb-2">
                      <div className="bg-blue-500/10 p-1.5 rounded-lg text-blue-400"><Car className="w-4 h-4" /></div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Vehicle Transit Mileage</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">Fuel Selection Profile</label>
                        <select
                          value={telemetry.fuelType}
                          onChange={(e) => handleModifyTelemetry('fuelType', e.target.value, true)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs px-2.5 py-1.5 text-slate-300 font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="petrol">Petrol Engine</option>
                          <option value="diesel">Diesel Engine</option>
                          <option value="cng">CNG Profile</option>
                          <option value="ev">Electric Vehicle (EV)</option>
                        </select>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] text-slate-500 font-bold block">Distance Driven</label>
                          <span className="font-mono text-xs text-blue-400 font-bold">{telemetry.carKm} km</span>
                        </div>
                        <input
                          type="range" min="0" max="250" step="5" value={telemetry.carKm}
                          onChange={(e) => handleModifyTelemetry('carKm', parseInt(e.target.value), true)}
                          className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aviation Flight Airtime Duration Slider Track */}
                <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center space-x-2.5 mb-2">
                      <div className="bg-sky-500/10 p-1.5 rounded-lg text-sky-400"><Plane className="w-4 h-4" /></div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Aviation Flight Airtime</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal mb-3">Logs scaled real-time aviation fuel coefficients based directly on trip duration.</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Flight Time</span>
                        <span className="font-mono text-xs font-bold text-sky-400">{telemetry.flightHours} Hours</span>
                      </div>
                      <input
                        type="range" min="0" max="24" step="1" value={telemetry.flightHours}
                        onChange={(e) => handleModifyTelemetry('flightHours', parseInt(e.target.value), true)}
                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Aviation Adjust</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleModifyTelemetry('flightHours', -1)}
                        aria-label="Decrease flight count"
                        className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleModifyTelemetry('flightHours', 1)}
                        aria-label="Increase flight count"
                        className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* INTERFACE B: UTILITIES SUB PANEL */}
              <div className={activeTab === 'utilities' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'hidden'}>
                {/* Electricity Input Counter Card */}
                <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-yellow-500/10 p-2 rounded-xl text-yellow-400"><Zap className="w-4 h-4" /></div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Grid Electricity</h4>
                      <p className="text-[10px] text-slate-500">+0.82kg CO₂ per kWh</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-md font-mono font-bold text-slate-200">{telemetry.electricityUsage} <span className="text-[10px] text-slate-500">kWh</span></span>
                    <div className="flex space-x-1.5">
                      <button onClick={() => handleModifyTelemetry('electricityUsage', -10)} className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg"><Minus className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleModifyTelemetry('electricityUsage', 10)} className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-lg"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>

                {/* LPG Cylinder Counter Card */}
                <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-orange-500/10 p-2 rounded-xl text-orange-400"><Flame className="w-4 h-4" /></div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Cooking LPG Cylinders</h4>
                      <p className="text-[10px] text-slate-500">+45kg CO₂ per Refill</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-md font-mono font-bold text-slate-200">{telemetry.lpgCylinders} <span className="text-[10px] text-slate-500">Units</span></span>
                    <div className="flex space-x-1.5">
                      <button onClick={() => handleModifyTelemetry('lpgCylinders', -1)} className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg"><Minus className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleModifyTelemetry('lpgCylinders', 1)} className="p-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-lg"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* INTERFACE C: DIET & FOOD SUB PANEL */}
              <div className={activeTab === 'diet' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'hidden'}>
                {/* Meat Meals Counter */}
                <div className="bg-slate-950 border border-slate-900/80 p-3 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="bg-red-500/10 p-1.5 rounded-lg text-red-400"><Utensils className="w-3.5 h-3.5" /></div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200">Meat Meals</h4>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-mono font-bold">{telemetry.meatMeals}</span>
                    <div className="flex space-x-1">
                      <button onClick={() => handleModifyTelemetry('meatMeals', -1)} className="p-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-md"><Minus className="w-3 h-3" /></button>
                      <button onClick={() => handleModifyTelemetry('meatMeals', 1)} className="p-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>

                {/* Vegan Meals Counter */}
                <div className="bg-slate-950 border border-slate-900/80 p-3 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="bg-teal-500/10 p-1.5 rounded-lg text-teal-400"><Leaf className="w-3.5 h-3.5" /></div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200">Vegan Meals</h4>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-mono font-bold text-teal-400">{telemetry.veganMeals}</span>
                    <div className="flex space-x-1">
                      <button onClick={() => handleModifyTelemetry('veganMeals', -1)} className="p-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-md"><Minus className="w-3 h-3" /></button>
                      <button onClick={() => handleModifyTelemetry('veganMeals', 1)} className="p-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>

                {/* Food Waste Metric Counter */}
                <div className="bg-slate-950 border border-slate-900/80 p-3 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="bg-zinc-500/10 p-1.5 rounded-lg text-zinc-400"><Trash2 className="w-3.5 h-3.5" /></div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200">Food Waste</h4>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-mono font-bold">{telemetry.foodWasteKg} <span className="text-[9px] text-slate-500">kg</span></span>
                    <div className="flex space-x-1">
                      <button onClick={() => handleModifyTelemetry('foodWasteKg', -1)} className="p-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-md"><Minus className="w-3 h-3" /></button>
                      <button onClick={() => handleModifyTelemetry('foodWasteKg', 1)} className="p-1 bg-zinc-800 text-zinc-300 rounded-md"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* INTERFACE D: OFFSETS & MITIGATION SUB PANEL */}
              <div className={activeTab === 'offsets' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'hidden'}>
                {/* Tree Plantings Offset Token */}
                <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400"><Trees className="w-4 h-4" /></div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Trees Planted</h4>
                      <p className="text-[10px] text-emerald-500">-20.0kg CO₂ Offset</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-md font-mono font-bold text-emerald-400">{telemetry.treePlantings}</span>
                    <div className="flex space-x-1.5">
                      <button onClick={() => handleModifyTelemetry('treePlantings', -1)} className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg"><Minus className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleModifyTelemetry('treePlantings', 1)} className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>

                {/* Composting Tracker Offset Token */}
                <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-teal-500/10 p-2 rounded-xl text-teal-400"><Leaf className="w-4 h-4" /></div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Composting Timeline</h4>
                      <p className="text-[10px] text-emerald-500">Methane Prevention Offset Track</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-md font-mono font-bold text-teal-400">{telemetry.compostWeeks} <span className="text-[10px] text-slate-500">Weeks</span></span>
                    <div className="flex space-x-1.5">
                      <button onClick={() => handleModifyTelemetry('compostWeeks', -1)} className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg"><Minus className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleModifyTelemetry('compostWeeks', 1)} className="p-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 rounded-lg"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* BOTTOM MATRIX BLOCK: LOG HISTORIES & DATA ENGINE BASES */}
        {/* SECTION 1: ENVIRONMENTAL IMPACT LOG HISTORY LEDGER */}
        <section className="col-span-12 bg-slate-900/20 border border-slate-900 rounded-3xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg"><History className="w-4 h-4" /></span>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Tactical Environmental Action Ledger</h3>
            </div>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {ledger.map((entry) => (
              <div key={entry.id} className="flex flex-col md:flex-row md:items-center justify-between text-xs p-3 bg-slate-950 border border-slate-900/80 rounded-xl hover:border-slate-800 transition duration-100">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-slate-500 text-[10px]">{entry.timestamp}</span>
                  <span className="font-bold text-slate-300">{entry.action}</span>
                </div>
                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${entry.impact.includes('Offset') || entry.impact.includes('Avoided') || entry.action.includes('Vegan') || entry.action.includes('Tree') || entry.action.includes('Transit')
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : entry.impact === '0.0kg CO₂' || entry.impact === 'Recalibrated' || entry.impact === 'Reduced Airtime' || entry.impact === 'Waste Reduced' || entry.impact === 'Power Conserved'
                      ? 'bg-slate-850 text-slate-400 border border-slate-800'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>{entry.impact}</span>
                  <span className="text-slate-400 italic text-[11px] font-medium">{entry.consequence}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: REGIONAL SCIENTIFIC CLIMATE DATA ACCORDION CENTER */}
        <section className="col-span-12 bg-slate-900/20 border border-slate-900 rounded-3xl p-6 backdrop-blur-md">
          <div className="flex items-center space-x-2 mb-6 border-b border-slate-900 pb-3">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg"><BookOpen className="w-4 h-4" /></span>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Ecosystem Science Reference Library</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
              <h4 className="text-xs font-black uppercase tracking-wider text-red-400 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Primary Drivers of Ecological Contamination</span>
              </h4>
              <div className="space-y-4">
                <div className="border-l-2 border-red-500/20 pl-3">
                  <h5 className="text-xs font-bold text-slate-200">Energy Generation & Supply Profiles</h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Electricity infrastructure profiles rely primarily on thermal coal plants, tracking heavy intensity grid metrics calculated at <span className="text-red-400 font-mono font-semibold">+0.82kg CO₂ per kWh</span>.</p>
                </div>
                <div className="border-l-2 border-red-500/20 pl-3">
                  <h5 className="text-xs font-bold text-slate-200">Aviation & Mobile Combustion Vectors</h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">High-altitude aviation releases gases directly into upper atmospheric layers, spiking passenger footprints dramatically based on airtime duration.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-4 flex items-center space-x-2">
                <Leaf className="w-3.5 h-3.5" />
                <span>Localized Mitigation Frameworks (India)</span>
              </h4>
              <div className="space-y-4">
                <div className="border-l-2 border-emerald-500/20 pl-3">
                  <h5 className="text-xs font-bold text-slate-200">BEE Star Star-Rating Protocols</h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Upgrading systems to Bureau of Energy Efficiency (BEE) 5-Star rated configurations minimizes standby load curves and cuts grid dependency metrics.</p>
                </div>
                <div className="border-l-2 border-emerald-500/20 pl-3">
                  <h5 className="text-xs font-bold text-slate-200">Ecosystem Sequestration loops</h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Mass tree plantings restore soil biomes and expand direct structural carbon capture capacity layer configurations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER ACCREDITATION LAYER */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-6 text-center text-xs text-slate-500 mt-12 font-medium">
        <p>© 2026 EcoSphere. Orchestrated via Advanced Prompt-Driven Engineering for PromptWars Challenge 3. Optimized for Carbon Footprint Awareness & Behavioral Nudging.</p>
      </footer>
    </div>
  );
}