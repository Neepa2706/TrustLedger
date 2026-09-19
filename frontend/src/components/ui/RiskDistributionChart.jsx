import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

const statusColorMap = {
  safe: '#16a34a',
  warning: '#d97706',
  critical: '#dc2626'
};

export default function RiskDistributionChart({
  data = [],
  height = 220,
  className = ''
}) {
  return (
    <div className={`w-full rounded-2xl border border-coffee-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-espresso tracking-wide">Applicant Risk Distribution</h3>
          <p className="text-xs text-stone-500 mt-0.5">Real-time cohort scoring breakdown across active loan inquiries</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span> Safe
          </span>
          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
            <span className="h-2 w-2 rounded-full bg-amber-600"></span> Caution
          </span>
          <span className="inline-flex items-center gap-1 text-rose-700 font-medium">
            <span className="h-2 w-2 rounded-full bg-rose-600"></span> Critical
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <XAxis
              dataKey="bracket"
              stroke="#8C7E74"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E8DFD1' }}
            />
            <YAxis
              stroke="#8C7E74"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E8DFD1' }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip
              cursor={{ fill: 'rgba(111, 78, 55, 0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-coffee-200 bg-white p-3 shadow-xl text-xs">
                      <div className="font-semibold text-espresso mb-1">{item.bracket}</div>
                      <div className="flex items-center justify-between gap-4 font-mono text-stone-700">
                        <span>Applications:</span>
                        <span className="font-bold text-coffee-800">{item.count.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 font-mono text-stone-500">
                        <span>Share:</span>
                        <span>{item.percentage}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={statusColorMap[entry.status] || '#6F4E37'}
                  fillOpacity={0.88}
                  className="transition-all hover:opacity-100"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
