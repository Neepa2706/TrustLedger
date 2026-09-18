import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  UserCheck,
  Share2,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  X,
  ExternalLink
} from 'lucide-react';

export default function InvestigationActions({ application }) {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const actions = [
    {
      label: 'Review Documents',
      subtext: 'Forensic PDF & salary slip inspection',
      icon: FileCheck2,
      onClick: () => navigate(`/documents?app=${application?.id || 'APP-1003'}&doc=bank_statement`)
    },
    {
      label: 'Review KYC',
      subtext: '3D facial liveness & identity signals',
      icon: UserCheck,
      onClick: () => navigate('/kyc-analysis')
    },
    {
      label: 'Explore Fraud Network',
      subtext: 'Graph entity cluster topology',
      icon: Share2,
      onClick: () => navigate('/fraud-network')
    },
    {
      label: 'Verify Evidence',
      subtext: 'SHA-256 tamper-evident ledger check',
      icon: Database,
      onClick: () => navigate('/evidence-ledger')
    },
    {
      label: 'Generate Risk Summary',
      subtext: 'Consolidated executive dossier',
      icon: FileSpreadsheet,
      onClick: () => triggerToast('This analysis module will be connected in the next phase.')
    }
  ];

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-6 backdrop-blur-sm relative">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Investigation Actions
          </h2>
          <p className="text-xs text-slate-400">
            Deep forensic drilldowns and proof verification workflows
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="mb-4 p-3 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-xs text-cyan-200 flex items-center justify-between gap-2 animate-fadeIn">
          <span className="font-mono">{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="text-cyan-400 hover:text-white"
            aria-label="Close notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={act.onClick}
              className="flex items-start gap-3 p-3.5 rounded-lg border border-surface-border bg-midnight-900/50 hover:bg-midnight-900 hover:border-cyan-500/40 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-midnight-950 border border-surface-border text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white group-hover:text-cyan-200 transition-colors font-mono">
                  {act.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {act.subtext}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
