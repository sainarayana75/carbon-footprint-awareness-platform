import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

/**
 * CompositionChart - Memoized data visualization for emissions.
 * Uses React.memo to optimize rendering and avoid recalculating pie charts unless results change.
 * 
 * @param {Object} props
 * @param {Object} props.results - Core footprint breakdown metrics
 */
export const CompositionChart = React.memo(function CompositionChart({ results }) {
  const chartData = useMemo(() => {
    const breakdown = results.breakdown || { transport: 0, utilities: 0, dietAndFood: 0 };
    return [
      { name: 'Transport', value: breakdown.transport || 0, color: '#3b82f6' }, // blue-500
      { name: 'Utilities', value: breakdown.utilities || 0, color: '#eab308' }, // yellow-500
      { name: 'Diet & Food', value: breakdown.dietAndFood || 0, color: '#ef4444' } // red-500
    ].filter(item => item.value > 0);
  }, [results.breakdown]);

  return (
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
            <ResponsiveContainer width="100%" height={128}>
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
  );
});

export default CompositionChart;
