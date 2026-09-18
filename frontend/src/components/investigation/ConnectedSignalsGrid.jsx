import React from 'react';
import { Smartphone, Globe, Landmark, Mail, Info, Share2 } from 'lucide-react';

export default function ConnectedSignalsGrid({ signals = [] }) {
  const defaultSignals = [
    { type: 'DEVICE', value: 'Device-7F2A', detail: 'Shared with 3 applications', icon: Smartphone },
    { type: 'IP ADDRESS', value: '192.0.2.24', detail: 'Seen across 4 applications', icon: Globe },
    { type: 'BANK ACCOUNT', value: '•••• 4821', detail: 'Linked to 2 applications', icon: Landmark },
    { type: 'EMAIL DOMAIN', value: 'example-business.com', detail: 'Seen across 3 applications', icon: Mail }
  ];

  const items = signals.length > 0 ? signals : defaultSignals;

  const iconByType = {
    DEVICE: Smartphone,
    'IP ADDRESS': Globe,
    'BANK ACCOUNT': Landmark,
    'EMAIL DOMAIN': Mail
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Share2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Connected Digital Signals
            </h2>
            <p className="text-xs text-slate-400">
              Entity graph collisions across device, telemetry, and payment coordinates
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-cyan-400">
          Synthetic Telemetry
        </span>
      </div>

      {/* Grid of 4 Signals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((sig, idx) => {
          const Icon = iconByType[sig.type] || sig.icon || Smartphone;

          return (
            <div
              key={idx}
              className="rounded-lg border border-surface-border bg-midnight-900/50 p-3.5 font-mono text-xs transition-all hover:border-slate-700"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[10px] uppercase font-semibold">
                  {sig.type}
                </span>
                <Icon className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <div className="text-white font-bold truncate text-sm">
                {sig.value}
              </div>
              <div className="text-[11px] text-amber-400/90 mt-1 font-sans">
                {sig.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Cautionary Note */}
      <div className="mt-4 p-3 rounded-lg border border-surface-border bg-midnight-950/80 flex items-start gap-2.5 text-xs text-slate-400">
        <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <span className="text-slate-300 font-semibold">Investigative Context: </span>
          Shared digital signals indicate relationships for investigation. A single shared signal does not independently establish fraud.
        </p>
      </div>
    </div>
  );
}
