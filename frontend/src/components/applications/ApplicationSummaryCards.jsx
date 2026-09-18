import React from 'react';
import { FileSpreadsheet, ShieldAlert, Clock, ShieldCheck } from 'lucide-react';

export default function ApplicationSummaryCards({ stats }) {
  const cards = [
    {
      id: 'total',
      title: 'TOTAL APPLICATIONS',
      value: stats?.total ?? 128,
      subtext: 'Across current review queue',
      icon: FileSpreadsheet,
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/40',
      valueColor: 'text-white'
    },
    {
      id: 'high-risk',
      title: 'HIGH RISK',
      value: String(stats?.highRisk ?? 6).padStart(2, '0'),
      subtext: 'Requires investigation',
      icon: ShieldAlert,
      badgeColor: 'border-red-500/40 text-red-400 bg-red-950/40',
      valueColor: 'text-red-400'
    },
    {
      id: 'needs-review',
      title: 'NEEDS REVIEW',
      value: stats?.needsReview ?? 17,
      subtext: 'Pending analyst review',
      icon: Clock,
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/40',
      valueColor: 'text-amber-400'
    },
    {
      id: 'verified',
      title: 'VERIFIED',
      value: stats?.verified ?? 105,
      subtext: 'Evidence verified',
      icon: ShieldCheck,
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
      valueColor: 'text-emerald-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="relative overflow-hidden rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm transition-all hover:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                  {card.title}
                </span>
                <div className={`mt-2 font-mono text-3xl font-bold tracking-tight ${card.valueColor}`}>
                  {card.value}
                </div>
              </div>
              <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${card.badgeColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-400">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
