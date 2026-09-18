import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Receipt, ShieldCheck, Video, ArrowRight, ExternalLink } from 'lucide-react';

export default function EvidenceSummaryGrid({ evidence = [], applicationId = 'APP-1003', onToast }) {
  const navigate = useNavigate();

  const defaultEvidence = [
    { id: 'ev1', type: 'BANK STATEMENT', status: 'Review', risk: 'Medium', state: 'Font Splicing Warning', icon: FileText, route: `/documents?app=${applicationId}&doc=bank_statement` },
    { id: 'ev2', type: 'GST FILING', status: 'Suspicious', risk: 'High', state: 'Turnover Variance Mismatch', icon: Receipt, route: `/documents?app=${applicationId}&doc=gst_filing` },
    { id: 'ev3', type: 'IDENTITY DOCUMENT', status: 'Verified', risk: 'Low', state: 'Checksum Match', icon: ShieldCheck, route: `/documents?app=${applicationId}&doc=identity_document` },
    { id: 'ev4', type: 'KYC VIDEO', status: 'Review', risk: 'Medium', state: 'Liveness Under Review', icon: Video, route: '/kyc-analysis' }
  ];

  const items = evidence.length > 0 ? evidence : defaultEvidence;

  const iconByType = {
    'BANK STATEMENT': FileText,
    'GST FILING': Receipt,
    'IDENTITY DOCUMENT': ShieldCheck,
    'KYC VIDEO': Video
  };

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'verified') return 'bg-emerald-950 text-emerald-300 border-emerald-500/30';
    if (s === 'suspicious') return 'bg-red-950 text-red-300 border-red-500/30';
    return 'bg-amber-950 text-amber-300 border-amber-500/30';
  };

  const getRiskBadge = (risk) => {
    const r = String(risk).toLowerCase();
    if (r === 'low') return 'text-emerald-400';
    if (r === 'high') return 'text-red-400';
    return 'text-amber-400';
  };

  const handleViewEvidence = (item) => {
    if (item.type && item.type.includes('KYC')) {
      navigate('/kyc-analysis');
      return;
    }
    const docSlug = item.type ? item.type.toLowerCase().replace(/\s+/g, '_') : 'bank_statement';
    navigate(`/documents?app=${applicationId}&doc=${docSlug}`);
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Evidence Summary
          </h2>
          <p className="text-xs text-slate-400">
            Cryptographic document payloads & optical verification status
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-400">
          4 Payloads Scanned
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {items.map((item, idx) => {
          const Icon = iconByType[item.type] || item.icon || FileText;

          return (
            <div
              key={item.id || idx}
              className="rounded-lg border border-surface-border bg-midnight-900/60 p-4 transition-all hover:border-slate-700 hover:bg-midnight-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-midnight-950 border border-surface-border flex items-center justify-center text-cyan-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white font-mono">
                        {item.type}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.state || 'Analysis complete'}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-mono border-t border-slate-800/80 pt-2 text-slate-400">
                  <span>Forensic Risk:</span>
                  <span className={`font-bold ${getRiskBadge(item.risk)}`}>
                    {item.risk}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 flex justify-end">
                <button
                  onClick={() => handleViewEvidence(item)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  <span>View Evidence Payload</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
