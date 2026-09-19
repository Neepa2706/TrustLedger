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
  critical: 'border-rose-300 text-rose-700 bg-rose-50',
  warning: 'border-amber-300 text-amber-700 bg-amber-50',
  safe: 'border-emerald-300 text-emerald-700 bg-emerald-50',
  info: 'border-coffee-300 text-coffee-700 bg-coffee-50'
};

export default function ActivityTimeline({
  events = [],
  title = 'Live Evidence & Fraud Intercept Feed',
  subtitle = 'Continuous cryptographic telemetry from perimeter security gates',
  className = ''
}) {
  return (
    <div className={`rounded-2xl border border-coffee-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-coffee-100">
        <div>
          <h3 className="text-sm font-semibold text-espresso tracking-wide">{title}</h3>
          {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
        </div>
        <span className="flex items-center gap-1.5 text-xs font-mono text-coffee-700 bg-coffee-50 px-2.5 py-1 rounded-full border border-coffee-200">
          <span className="h-2 w-2 rounded-full bg-coffee-600 animate-pulse"></span>
          STREAMING
        </span>
      </div>

      <div className="relative mt-5 pl-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-coffee-200">
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

                <div className="rounded-xl border border-coffee-200 bg-warm-50/60 p-3.5 transition-all duration-200 hover:border-coffee-400 hover:bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-espresso group-hover:text-coffee-800 transition-colors">
                        {event.title}
                      </span>
                      {event.entityId && (
                        <span className="font-mono text-[11px] text-coffee-700 bg-white px-1.5 py-0.5 rounded border border-coffee-200">
                          {event.entityId}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-stone-500">
                      {event.timestamp}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    {event.details}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-coffee-100 pt-2 text-[11px] font-mono text-stone-500">
                    <div className="flex items-center gap-1">
                      <Fingerprint className="h-3 w-3 text-coffee-600" />
                      <span>Proof Hash: <span className="text-espresso font-semibold">{event.hash}</span></span>
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
