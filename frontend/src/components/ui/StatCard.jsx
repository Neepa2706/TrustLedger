import React from 'react';
import { TrendingUp, TrendingDown, ShieldAlert, ShieldCheck, Activity, Database } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const categoryIcons = {
  threat: ShieldAlert,
  integrity: Database,
  financial: ShieldCheck,
  activity: Activity,
};

export default function StatCard({
  title,
  value,
  prefix = '',
  suffix = '',
  change,
  trend = 'up',
  isPositiveTrend = true,
  description,
  badge,
  category = 'activity',
  className = ''
}) {
  const IconComponent = categoryIcons[category] || Activity;
  const isUp = trend === 'up';

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-coffee-200 bg-white p-5 transition-all duration-300 hover:border-coffee-300 hover:shadow-md shadow-card ${className}`}>
      {/* Subtle top indicator highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-coffee-400 to-transparent"></div>

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-stone-500 font-mono">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            {prefix && <span className="text-xl font-bold text-stone-600">{prefix}</span>}
            <span className="font-mono text-2xl font-bold tracking-tight text-espresso">
              {typeof value === 'number' ? (
                <AnimatedCounter value={value} />
              ) : (
                value
              )}
            </span>
            {suffix && <span className="text-xs font-mono text-stone-500">{suffix}</span>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-coffee-200 bg-coffee-50 text-coffee-700 shadow-xs">
            <IconComponent className="h-4 w-4" />
          </div>
          {badge && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-coffee-100 pt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-0.5 font-mono font-medium ${
            isPositiveTrend ? 'text-emerald-700' : 'text-amber-800'
          }`}>
            {isUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change}
          </span>
          {description && (
            <span className="text-stone-500 truncate max-w-[140px]" title={description}>
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
