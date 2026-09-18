import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Fingerprint, Lock, ArrowUpRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const levelIconMap = {
  critical: ShieldAlert,
  warning: AlertTriangle,
  safe: ShieldCheck,
  info: Lock
};

const levelColorMap = {
  critical: 'border-red-500/40 text-red-400 bg-red-950/30',
  warning: 'border-amber-500/40 text-amber-400 bg-amber-950/30',
  safe: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30',
  info: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30'
};

export default function ActivityTimeline({
  events = [],
  title = 'Live Evidence & Fraud Intercept Feed',
  subtitle = 'Continuous cryptographic telemetry from perimeter security gates',
  className = ''
}) {
  return (
    <div className={`rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-surface-border">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <span className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          STREAMING
        </span>
      </div>

      <div className="relative mt-5 pl-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
        <div className="space-y-6">
          {events.map((event) => {
            const Icon = levelIconMap[event.riskLevel] || Fingerprint;
            const colorClasses = levelColorMap[event.riskLevel] || levelColorMap.info;

            return (
              <div key={event.id} className="relative group">
                {/* Node Icon on Timeline spine */}
                <div className={`absolute -left-[23px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border shadow-sm ${colorClasses}`}>
                  <Icon className="h-3 w-3" />
                </div>

                <div className="rounded-lg border border-surface-border bg-midnight-900/60 p-3.5 transition-all duration-200 hover:border-slate-700 hover:bg-midnight-900">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {event.title}
                      </span>
                      {event.entityId && (
                        <span className="font-mono text-[11px] text-cyan-400/90 bg-midnight-950 px-1.5 py-0.5 rounded border border-surface-border">
                          {event.entityId}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {event.timestamp}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {event.details}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-1">
                      <Fingerprint className="h-3 w-3 text-cyan-400" />
                      <span>Proof Hash: <span className="text-slate-300">{event.hash}</span></span>
                    </div>
                    <StatusBadge
                      status={event.riskLevel === 'safe' ? 'VERIFIED' : event.riskLevel === 'warning' ? 'SUSPICIOUS' : 'CRITICAL'}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
