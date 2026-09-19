import React from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

export default function MiniTrendChart({
  data = [],
  dataKey = 'value',
  color = '#00f0ff',
  height = 48,
  showTooltip = false,
  className = ''
}) {
  const gradientId = `trendGrad-${color.replace('#', '')}`;

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-coffee-200 bg-white px-2.5 py-1 text-[11px] font-mono text-espresso shadow-md">
                      {payload[0].value}
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.75}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
