import React, { useMemo } from 'react';
import { Sun, Trees, Waves, Cloud, Factory, AlertTriangle } from 'lucide-react';
import { ECOSYSTEM_STATES, THRESHOLDS } from '../constants/constants';

/**
 * EcosystemCanvas - Simulator visualization canvas (Left Column)
 * Manages dynamically computed visual states based on results and daily budgets.
 * 
 * @param {Object} props
 * @param {Object} props.results - Calculated cumulative carbon and score metrics
 */
export function EcosystemCanvas({ results }) {
  // Computes active theme and meta-info from the constants
  const ecosystemState = useMemo(() => {
    const score = results.environmentalScore;
    if (score < THRESHOLDS.pristineMax) {
      return ECOSYSTEM_STATES.pristine;
    } else if (score > THRESHOLDS.collapsedMin) {
      return ECOSYSTEM_STATES.collapsed;
    } else {
      return ECOSYSTEM_STATES.strained;
    }
  }, [results.environmentalScore]);

  // Carbon budget comparison
  const budgetData = useMemo(() => {
    const dailyBudget = THRESHOLDS.dailyBudget;
    const netFootprint = results.cumulativeCarbon;
    const percentage = Math.min(100, Math.round((netFootprint / dailyBudget) * 100));
    const isOver = netFootprint > dailyBudget;
    return { dailyBudget, percentage, isOver };
  }, [results.cumulativeCarbon]);

  return (
    <section 
      aria-label="EcoSphere Canvas" 
      className="lg:col-span-5 flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-900 bg-slate-900/40 backdrop-blur-md p-6 relative min-h-[520px]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 opacity-90 ${ecosystemState.themeClass}`} />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-6">
        <div className="absolute top-0 right-0 bg-slate-900/95 border border-slate-800 rounded-full px-4 py-1.5 flex items-center space-x-2 shadow-xl">
          <span className={`w-2.5 h-2.5 rounded-full ${ecosystemState.badgeColor}`} />
          <span className="text-xs font-black uppercase tracking-widest text-slate-200">{ecosystemState.title}</span>
        </div>

        {/* Ecosystem Graphics Area */}
        <div className="relative w-64 h-64 flex items-center justify-center mt-4">
          <div className="absolute top-2 w-full flex justify-between px-6">
            {results.environmentalScore <= THRESHOLDS.collapsedMin ? (
              <Sun className={`w-12 h-12 text-amber-400 animate-spin-slow transition-all duration-1000 ${results.environmentalScore > THRESHOLDS.pristineMax ? 'opacity-40 scale-75 text-amber-600' : 'scale-100'}`} />
            ) : (
              <AlertTriangle className="w-12 h-12 text-red-500 animate-bounce" />
            )}
            <div className="flex space-x-2">
              <Cloud className={`w-8 h-8 text-slate-400 transition-all duration-1000 ${results.environmentalScore < THRESHOLDS.pristineMax ? 'opacity-10 scale-50' : 'opacity-80'}`} />
              <Cloud className={`w-10 h-10 text-slate-500 transition-all duration-1000 ${results.environmentalScore < THRESHOLDS.pristineMax ? 'opacity-0 scale-30' : 'opacity-90 animate-pulse'}`} />
            </div>
          </div>

          {/* Central Biome Island Ring */}
          <div className={`w-52 h-52 rounded-full transition-all duration-1000 relative flex items-center justify-center overflow-hidden border ${results.environmentalScore < THRESHOLDS.pristineMax
            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_50px_rgba(16,185,129,0.25)] border-emerald-300/20'
            : results.environmentalScore > THRESHOLDS.collapsedMin
              ? 'bg-gradient-to-br from-stone-800 to-zinc-950 shadow-[0_0_40px_rgba(239,68,68,0.1)] border-red-500/20'
              : 'bg-gradient-to-br from-amber-500 to-stone-600 shadow-[0_0_30px_rgba(245,158,11,0.15)] border-amber-400/20'
            }`}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M-5,50 C25,35 75,65 105,50" fill="none" stroke={results.environmentalScore < THRESHOLDS.pristineMax ? '#0284c7' : results.environmentalScore > THRESHOLDS.collapsedMin ? '#451a03' : '#d97706'} strokeWidth="8" className="transition-colors duration-1000" />
            </svg>

            <div className="relative z-10 w-full h-full flex flex-col justify-between p-6">
              <div className="flex justify-around items-center h-14 mt-2">
                <Trees className={`w-8 h-8 transition-all duration-1000 ${results.environmentalScore < THRESHOLDS.pristineMax ? 'text-teal-950 scale-110' : results.environmentalScore > THRESHOLDS.collapsedMin ? 'text-stone-900 opacity-10 scale-50' : 'text-stone-700'}`} />
                <Trees className={`w-10 h-10 transition-all duration-1000 ${results.environmentalScore < THRESHOLDS.pristineMax ? 'text-emerald-950 scale-120 animate-pulse' : results.environmentalScore > THRESHOLDS.collapsedMin ? 'text-stone-900 opacity-5 scale-40' : 'text-stone-800'}`} />
              </div>

              <div className="flex justify-center items-center h-14 mb-2">
                {results.environmentalScore > THRESHOLDS.collapsedMin ? (
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

      {/* Metrics Penalty and Carbon Budget Gauges */}
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
                className={`h-full transition-all duration-1000 rounded-full ${results.environmentalScore < THRESHOLDS.pristineMax
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : results.environmentalScore > THRESHOLDS.collapsedMin
                    ? 'bg-gradient-to-r from-red-600 to-orange-500'
                    : 'bg-gradient-to-r from-amber-500 to-amber-300'
                  }`}
                style={{ width: `${results.environmentalScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">{ecosystemState.description}</p>
          </div>

          {/* Budget Ring */}
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
  );
}

export default EcosystemCanvas;
