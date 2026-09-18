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
    <div className={`relative overflow-hidden rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:bg-surface-hover ${className}`}>
      {/* Subtle top indicator highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            {prefix && <span className="text-xl font-bold text-slate-300">{prefix}</span>}
            <span className="font-mono text-2xl font-bold tracking-tight text-white">
              {typeof value === 'number' ? (
                <AnimatedCounter value={value} />
              ) : (
                value
              )}
            </span>
            {suffix && <span className="text-xs font-mono text-slate-400">{suffix}</span>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-midnight-900/90 text-cyan-400 shadow-sm">
            <IconComponent className="h-4 w-4" />
          </div>
          {badge && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-midnight-950 text-slate-300 border border-slate-700/50">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-0.5 font-mono font-medium ${
            isPositiveTrend ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {isUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change}
          </span>
          {description && (
            <span className="text-slate-400 truncate max-w-[140px]" title={description}>
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
