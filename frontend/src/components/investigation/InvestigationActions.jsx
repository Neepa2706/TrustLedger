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
    <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-sm relative">
      <div className="flex items-center justify-between pb-3 border-b border-coffee-100 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-espresso tracking-wide">
            Investigation Actions
          </h2>
          <p className="text-xs text-stone-500">
            Deep forensic drilldowns and proof verification workflows
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="mb-4 p-3 rounded-xl border border-coffee-300 bg-coffee-50 text-xs text-coffee-950 flex items-center justify-between gap-2 animate-fadeIn">
          <span className="font-mono">{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="text-coffee-700 hover:text-espresso"
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
              className="flex items-start gap-3 p-3.5 rounded-xl border border-coffee-200 bg-warm-50/60 hover:bg-white hover:border-coffee-400 text-left transition-all shadow-xs group"
            >
              <div className="p-2 rounded-lg bg-white border border-coffee-200 text-coffee-700 group-hover:bg-coffee-50 group-hover:text-coffee-900 shrink-0 shadow-xs">
                <Icon className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-espresso group-hover:text-coffee-800 transition-colors font-mono">
                  {act.label}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5 truncate">
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
