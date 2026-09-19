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
      badgeColor: 'border-coffee-200 text-coffee-700 bg-coffee-50',
      valueColor: 'text-espresso'
    },
    {
      id: 'high-risk',
      title: 'HIGH RISK',
      value: String(stats?.highRisk ?? 6).padStart(2, '0'),
      subtext: 'Requires investigation',
      icon: ShieldAlert,
      badgeColor: 'border-red-200 text-red-700 bg-red-50',
      valueColor: 'text-red-700'
    },
    {
      id: 'needs-review',
      title: 'NEEDS REVIEW',
      value: stats?.needsReview ?? 17,
      subtext: 'Pending analyst review',
      icon: Clock,
      badgeColor: 'border-amber-200 text-amber-800 bg-amber-50',
      valueColor: 'text-amber-800'
    },
    {
      id: 'verified',
      title: 'VERIFIED',
      value: stats?.verified ?? 105,
      subtext: 'Evidence verified',
      icon: ShieldCheck,
      badgeColor: 'border-emerald-200 text-emerald-700 bg-emerald-50',
      valueColor: 'text-emerald-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="relative overflow-hidden rounded-2xl border border-coffee-200 bg-white p-5 shadow-card transition-all hover:border-coffee-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-medium">
                  {card.title}
                </span>
                <div className={`mt-2 font-mono text-3xl font-bold tracking-tight ${card.valueColor}`}>
                  {card.value}
                </div>
              </div>
              <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shadow-xs ${card.badgeColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-coffee-100 text-xs text-stone-500 font-sans">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
