import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, AlertOctagon, Share2, Database, ArrowRight, ShieldAlert } from 'lucide-react';

export default function AttentionReasonsCard({ reasons = [] }) {
  const navigate = useNavigate();

  const defaultReasons = [
    {
      id: 'r1',
      title: 'Potential document manipulation signal',
      severity: 'critical',
      explanation: 'Font subset splice detected on net monthly salary row of bank statement.',
      linkTo: '/documents'
    },
    {
      id: 'r2',
      title: 'KYC video requires additional liveness review',
      severity: 'high',
      explanation: 'Facial micro-expression and depth variance flagged as borderline synthetic reproduction.',
      linkTo: '/kyc-analysis'
    },
    {
      id: 'r3',
      title: 'Multiple connected applications share digital signals',
      severity: 'critical',
      explanation: 'Device fingerprint and routing number collide with 3 previous loan inquiries across different identities.',
      linkTo: '/fraud-network'
    },
    {
      id: 'r4',
      title: 'Evidence integrity requires verification',
      severity: 'high',
      explanation: 'SHA-256 header hash diverges from original banking portal export signature.',
      linkTo: '/evidence-ledger'
    }
  ];

  const items = reasons.length > 0 ? reasons : defaultReasons;

  const severityBadge = (sev) => {
    if (sev === 'critical') {
      return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 uppercase font-semibold">Critical</span>;
    }
    if (sev === 'high') {
      return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-500/30 uppercase font-semibold">High Priority</span>;
    }
    return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 uppercase font-semibold">Advisory</span>;
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Why this application requires attention
            </h2>
            <p className="text-xs text-slate-400">
              Evidence-based triggers requiring active investigator signoff
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {items.length} Key Triggers
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="rounded-lg border border-surface-border bg-midnight-900/50 p-4 transition-all hover:border-slate-700 hover:bg-midnight-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-red-400 shrink-0" />
                <span className="text-xs font-semibold text-white">
                  {item.title}
                </span>
              </div>
              {severityBadge(item.severity)}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              {item.explanation}
            </p>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex justify-end">
              <button
                onClick={() => navigate(item.linkTo || '/documents')}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>View Evidence</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
