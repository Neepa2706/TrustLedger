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
  safe: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444'
};

export default function RiskDistributionChart({
  data = [],
  height = 220,
  className = ''
}) {
  return (
    <div className={`w-full rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">Applicant Risk Distribution</h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time cohort scoring breakdown across active loan inquiries</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Safe
          </span>
          <span className="inline-flex items-center gap-1 text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span> Caution
          </span>
          <span className="inline-flex items-center gap-1 text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500"></span> Critical
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <XAxis
              dataKey="bracket"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-surface-border bg-midnight-900/95 p-3 shadow-xl backdrop-blur text-xs">
                      <div className="font-semibold text-white mb-1">{item.bracket}</div>
                      <div className="flex items-center justify-between gap-4 font-mono text-slate-300">
                        <span>Applications:</span>
                        <span className="font-bold text-cyan-300">{item.count.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 font-mono text-slate-400">
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
                  fill={statusColorMap[entry.status] || '#00f0ff'}
                  fillOpacity={0.85}
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
