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
        ? 'border-red-500/30 text-red-300 bg-red-950/30'
        : 'border-emerald-500/30 text-emerald-300 bg-emerald-950/30'
    },
    {
      label: 'ANALYSIS STATUS',
      value: application.analysisStatus || 'AI Analysis Complete',
      icon: Cpu,
      badge: 'border-cyan-500/30 text-cyan-300 bg-cyan-950/30'
    },
    {
      label: 'EVIDENCE STATUS',
      value: application.integrityStatus === 'Warning' ? 'Integrity Warning' : 'Evidence Sealed',
      icon: Lock,
      badge: application.integrityStatus === 'Warning'
        ? 'border-red-500/30 text-red-300 bg-red-950/30'
        : 'border-emerald-500/30 text-emerald-300 bg-emerald-950/30'
    },
    {
      label: 'NETWORK STATUS',
      value: application.networkStatus === 'Connected' ? 'Connected Signals Detected' : 'Perimeter Clear',
      icon: Network,
      badge: application.networkStatus === 'Connected'
        ? 'border-amber-500/30 text-amber-300 bg-amber-950/30'
        : 'border-emerald-500/30 text-emerald-300 bg-emerald-950/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
      {statuses.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`rounded-xl border p-3 flex items-center gap-3 backdrop-blur-sm ${item.badge}`}
          >
            <div className="p-1.5 rounded-lg bg-midnight-950/60 border border-current shrink-0">
              <Icon className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase text-slate-400 font-medium">
                {item.label}
              </div>
              <div className="font-semibold text-white truncate text-xs mt-0.5" title={item.value}>
                {item.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
