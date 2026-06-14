import React from 'react';
import { History } from 'lucide-react';

/**
 * ActionLedger - Chronological transaction journal
 * 
 * @param {Object} props
 * @param {Array} props.ledger - List of action entries
 */
export function ActionLedger({ ledger }) {
  return (
    <section className="col-span-12 bg-slate-900/20 border border-slate-900 rounded-3xl p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <History className="w-4 h-4" />
          </span>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Tactical Environmental Action Ledger</h3>
        </div>
      </div>

      <div className="max-h-40 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {ledger.map((entry) => (
          <div 
            key={entry.id} 
            className="flex flex-col md:flex-row md:items-center justify-between text-xs p-3 bg-slate-950 border border-slate-900/80 rounded-xl hover:border-slate-800 transition duration-100"
          >
            <div className="flex items-center space-x-3">
              <span className="font-mono text-slate-500 text-[10px]">{entry.timestamp}</span>
              <span className="font-bold text-slate-300">{entry.action}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                entry.impact.includes('Offset') || 
                entry.impact.includes('Avoided') || 
                entry.action.includes('Vegan') || 
                entry.action.includes('Tree') || 
                entry.action.includes('Transit')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : entry.impact === '0.0kg CO₂' || 
                    entry.impact === 'Recalibrated' || 
                    entry.impact === 'Reduced Airtime' || 
                    entry.impact === 'Waste Reduced' || 
                    entry.impact === 'Power Conserved'
                    ? 'bg-slate-850 text-slate-400 border border-slate-800'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {entry.impact}
              </span>
              <span className="text-slate-400 italic text-[11px] font-medium">{entry.consequence}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ActionLedger;
