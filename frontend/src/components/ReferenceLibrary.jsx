import React from 'react';
import { BookOpen, AlertTriangle, Leaf } from 'lucide-react';

/**
 * ReferenceLibrary - Displays static informational guides on carbon drivers
 * and regional environmental initiatives (e.g. BEE Star Ratings, PM-Surya Ghar).
 */
export function ReferenceLibrary() {
  return (
    <section className="col-span-12 bg-slate-900/20 border border-slate-900 rounded-3xl p-6 backdrop-blur-md">
      <div className="flex items-center space-x-2 mb-6 border-b border-slate-900 pb-3">
        <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <BookOpen className="w-4 h-4" />
        </span>
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Ecosystem Science Reference Library</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ecological Contamination Section */}
        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
          <h4 className="text-xs font-black uppercase tracking-wider text-red-400 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Primary Drivers of Ecological Contamination</span>
          </h4>
          <div className="space-y-4">
            <div className="border-l-2 border-red-500/20 pl-3">
              <h5 className="text-xs font-bold text-slate-200">Energy Generation & Supply Profiles</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Electricity infrastructure profiles rely primarily on thermal coal plants, tracking heavy intensity grid metrics calculated at{' '}
                <span className="text-red-400 font-mono font-semibold">+0.82kg CO₂ per kWh</span>.
              </p>
            </div>
            <div className="border-l-2 border-red-500/20 pl-3">
              <h5 className="text-xs font-bold text-slate-200">Aviation & Mobile Combustion Vectors</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                High-altitude aviation releases gases directly into upper atmospheric layers, spiking passenger footprints dramatically based on airtime duration.
              </p>
            </div>
          </div>
        </div>

        {/* Localized Mitigation Section */}
        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-4 flex items-center space-x-2">
            <Leaf className="w-3.5 h-3.5" />
            <span>Localized Mitigation Frameworks (India)</span>
          </h4>
          <div className="space-y-4">
            <div className="border-l-2 border-emerald-500/20 pl-3">
              <h5 className="text-xs font-bold text-slate-200">BEE Star Star-Rating Protocols</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Upgrading household appliances to Bureau of Energy Efficiency (BEE) 5-Star rated configurations minimizes standby load curves and cuts grid dependency metrics.
              </p>
            </div>
            <div className="border-l-2 border-emerald-500/20 pl-3">
              <h5 className="text-xs font-bold text-slate-200">PM-Surya Ghar Muft Bijli Yojana</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Integrating solar rooftops under national solar schemes (PM-Surya Ghar) offsets grid load, supplying clean decentralized energy back into local networks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReferenceLibrary;
