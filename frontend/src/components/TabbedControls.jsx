import React from 'react';
import { 
  Car, 
  Home, 
  Utensils, 
  Leaf, 
  Plane, 
  Zap, 
  Flame, 
  Minus, 
  Plus, 
  Trash2, 
  Trees 
} from 'lucide-react';
import { TABS } from '../constants/constants';

const TAB_ICONS = {
  transport: Car,
  utilities: Home,
  diet: Utensils,
  offsets: Leaf
};

/**
 * TabbedControls - Interactive telemetry input tab controllers
 * 
 * @param {Object} props
 * @param {string} props.activeTab - Active tracking tab
 * @param {Function} props.setActiveTab - Sets the active tracking tab
 * @param {Object} props.telemetry - Granular telemetry values
 * @param {Function} props.handleModifyTelemetry - Modifies a telemetry key
 */
export function TabbedControls({
  activeTab,
  setActiveTab,
  telemetry,
  handleModifyTelemetry
}) {
  return (
    <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-5 backdrop-blur-md flex flex-col">
      {/* UI Tab Control Selector List Bar */}
      <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-900 mb-5 overflow-x-auto">
        {TABS.map((tab) => {
          const IconComponent = TAB_ICONS[tab.id] || Car;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 text-xs font-black px-3 py-2 rounded-lg whitespace-nowrap transition duration-150 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                isActive 
                  ? 'bg-slate-900 border border-slate-800 text-emerald-400 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB INTERACTIVE CONTROL INTERFACES */}
      <div className="min-h-[220px]">
        {/* INTERFACE A: TRANSPORT COMPONENT SUB PANEL */}
        {activeTab === 'transport' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mileage Slider */}
            <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2.5 mb-2">
                  <div className="bg-blue-500/10 p-1.5 rounded-lg text-blue-400">
                    <Car className="w-4 h-4" />
                  </div>
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
                      type="range" 
                      min="0" 
                      max="250" 
                      step="5" 
                      value={telemetry.carKm}
                      onChange={(e) => handleModifyTelemetry('carKm', parseInt(e.target.value), true)}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Hours Slider */}
            <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2.5 mb-2">
                  <div className="bg-sky-500/10 p-1.5 rounded-lg text-sky-400">
                    <Plane className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Aviation Flight Airtime</h4>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal mb-3">
                  Logs scaled real-time aviation fuel coefficients based directly on trip duration.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Flight Time</span>
                    <span className="font-mono text-xs font-bold text-sky-400">{telemetry.flightHours} Hours</span>
                  </div>
                  <input
                    type="range" 
                    min="0" 
                    max="24" 
                    step="1" 
                    value={telemetry.flightHours}
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
        )}

        {/* INTERFACE B: UTILITIES SUB PANEL */}
        {activeTab === 'utilities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Grid Electricity */}
            <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-yellow-500/10 p-2 rounded-xl text-yellow-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Grid Electricity</h4>
                  <p className="text-[10px] text-slate-500">+0.82kg CO₂ per kWh</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-md font-mono font-bold text-slate-200">
                  {telemetry.electricityUsage} <span className="text-[10px] text-slate-500">kWh</span>
                </span>
                <div className="flex space-x-1.5">
                  <button 
                    onClick={() => handleModifyTelemetry('electricityUsage', -10)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleModifyTelemetry('electricityUsage', 10)} 
                    className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* LPG Cooking Gas */}
            <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-orange-500/10 p-2 rounded-xl text-orange-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Cooking LPG Cylinders</h4>
                  <p className="text-[10px] text-slate-500">+45kg CO₂ per Refill</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-md font-mono font-bold text-slate-200">
                  {telemetry.lpgCylinders} <span className="text-[10px] text-slate-500">Units</span>
                </span>
                <div className="flex space-x-1.5">
                  <button 
                    onClick={() => handleModifyTelemetry('lpgCylinders', -1)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleModifyTelemetry('lpgCylinders', 1)} 
                    className="p-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INTERFACE C: DIET & FOOD SUB PANEL */}
        {activeTab === 'diet' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Meat Meals */}
            <div className="bg-slate-950 border border-slate-900/80 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center space-x-2 mb-3">
                <div className="bg-red-500/10 p-1.5 rounded-lg text-red-400">
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200">Meat Meals</h4>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-mono font-bold">{telemetry.meatMeals}</span>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleModifyTelemetry('meatMeals', -1)} 
                    className="p-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-md"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleModifyTelemetry('meatMeals', 1)} 
                    className="p-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Vegan Meals */}
            <div className="bg-slate-950 border border-slate-900/80 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center space-x-2 mb-3">
                <div className="bg-teal-500/10 p-1.5 rounded-lg text-teal-400">
                  <Leaf className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200">Vegan Meals</h4>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-mono font-bold text-teal-400">{telemetry.veganMeals}</span>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleModifyTelemetry('veganMeals', -1)} 
                    className="p-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-md"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleModifyTelemetry('veganMeals', 1)} 
                    className="p-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Food Waste */}
            <div className="bg-slate-950 border border-slate-900/80 p-3 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center space-x-2 mb-3">
                <div className="bg-zinc-500/10 p-1.5 rounded-lg text-zinc-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200">Food Waste</h4>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-mono font-bold">
                  {telemetry.foodWasteKg} <span className="text-[9px] text-slate-500">kg</span>
                </span>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleModifyTelemetry('foodWasteKg', -1)} 
                    className="p-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-md"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleModifyTelemetry('foodWasteKg', 1)} 
                    className="p-1 bg-zinc-800 text-zinc-300 rounded-md"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INTERFACE D: OFFSETS & MITIGATION SUB PANEL */}
        {activeTab === 'offsets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trees Planted */}
            <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
                  <Trees className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Trees Planted</h4>
                  <p className="text-[10px] text-emerald-500">-20.0kg CO₂ Offset</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-md font-mono font-bold text-emerald-400">{telemetry.treePlantings}</span>
                <div className="flex space-x-1.5">
                  <button 
                    onClick={() => handleModifyTelemetry('treePlantings', -1)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleModifyTelemetry('treePlantings', 1)} 
                    className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Composting Timeline */}
            <div className="bg-slate-950 border border-slate-900/80 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-teal-500/10 p-2 rounded-xl text-teal-400">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Composting Timeline</h4>
                  <p className="text-[10px] text-emerald-500">Methane Prevention Offset Track</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-md font-mono font-bold text-teal-400">
                  {telemetry.compostWeeks} <span className="text-[10px] text-slate-500">Weeks</span>
                </span>
                <div className="flex space-x-1.5">
                  <button 
                    onClick={() => handleModifyTelemetry('compostWeeks', -1)} 
                    className="p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleModifyTelemetry('compostWeeks', 1)} 
                    className="p-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TabbedControls;
