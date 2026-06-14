import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * SmartNudge - Displays AI-driven recommendations from Gemini
 * 
 * @param {Object} props
 * @param {string} props.nudge - Suggestion text
 * @param {boolean} props.nudgeLoading - Spinner state
 * @param {Function} props.handleRefreshNudge - Refresh recommendation trigger
 */
export function SmartNudge({ nudge, nudgeLoading, handleRefreshNudge }) {
  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full filter blur-xl" />
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Gemini Strategic Advisory</h3>
        </div>
        <button
          onClick={handleRefreshNudge} 
          disabled={nudgeLoading} 
          aria-label="Refresh smart nudge recommendations"
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 transition duration-100 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${nudgeLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="min-h-[50px] flex items-center">
        {nudgeLoading ? (
          <div className="space-y-2 w-full animate-pulse" role="status" aria-label="Loading smart nudge">
            <div className="h-3 bg-slate-850 rounded w-3/4" />
            <div className="h-3 bg-slate-850 rounded w-5/6" />
          </div>
        ) : (
          <p className="text-xs text-slate-200 italic leading-relaxed font-medium">
            "{nudge || 'Adjust data trackers below to activate AI tactical recommendation logs.'}"
          </p>
        )}
      </div>
    </div>
  );
}

export default SmartNudge;
