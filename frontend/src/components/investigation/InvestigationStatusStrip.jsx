import React from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, Network, Cpu, Lock } from 'lucide-react';

export default function InvestigationStatusStrip({ application }) {
  const isHighRisk = application.riskScore > 65;

  const statuses = [
    {
      label: 'APPLICATION STATUS',
      value: application.applicationStatus || (isHighRisk ? 'Needs Investigation' : 'Verified'),
      icon: isHighRisk ? AlertCircle : CheckCircle2,
      badge: isHighRisk
        ? 'border-rose-200 text-rose-800 bg-rose-50'
        : 'border-emerald-200 text-emerald-800 bg-emerald-50'
    },
    {
      label: 'ANALYSIS STATUS',
      value: application.analysisStatus || 'AI Analysis Complete',
      icon: Cpu,
      badge: 'border-coffee-200 text-coffee-800 bg-warm-50'
    },
    {
      label: 'EVIDENCE STATUS',
      value: application.integrityStatus === 'Warning' ? 'Integrity Warning' : 'Evidence Sealed',
      icon: Lock,
      badge: application.integrityStatus === 'Warning'
        ? 'border-rose-200 text-rose-800 bg-rose-50'
        : 'border-emerald-200 text-emerald-800 bg-emerald-50'
    },
    {
      label: 'NETWORK STATUS',
      value: application.networkStatus === 'Connected' ? 'Connected Signals Detected' : 'Perimeter Clear',
      icon: Network,
      badge: application.networkStatus === 'Connected'
        ? 'border-amber-200 text-amber-800 bg-amber-50'
        : 'border-emerald-200 text-emerald-800 bg-emerald-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
      {statuses.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`rounded-2xl border p-3 flex items-center gap-3 shadow-xs ${item.badge}`}
          >
            <div className="p-2 rounded-xl bg-white border border-current shrink-0 shadow-xs">
              <Icon className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase text-stone-500 font-semibold tracking-wider">
                {item.label}
              </div>
              <div className="font-bold text-espresso truncate text-xs mt-0.5" title={item.value}>
                {item.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
