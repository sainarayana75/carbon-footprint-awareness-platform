import React from 'react';
import { Leaf, RotateCcw } from 'lucide-react';

/**
 * Header - Stateless navbar for EcoSphere
 * Displays branding logo and provides application reset trigger.
 * 
 * @param {Object} props
 * @param {Function} props.handleReset - Callback triggered on platform reset
 */
export function Header({ handleReset }) {
  return (
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
  );
}

export default Header;
