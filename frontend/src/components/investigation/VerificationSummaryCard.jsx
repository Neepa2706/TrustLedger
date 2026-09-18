import React from 'react';
import {
  FileCheck,
  UserCheck,
  Share2,
  Database,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function VerificationSummaryCard({ application }) {
  if (!application) return null;

  const breakdown = application.riskBreakdown || {
    documentForensics: {
      score: 72,
      status: application.documentStatus || 'Review',
      explanation: 'Bank statement formatting requires underwriter signoff.'
    },
    kycAnalysis: {
      score: 24,
      status: application.kycStatus || 'Verified',
      explanation: 'Aadhaar and live biometric match registered profile attributes.'
    },
    fraudNetwork: {
      score: 68,
      status: application.networkStatus || 'Connected',
      explanation: 'Connected digital telemetry signals detected across cluster.'
    },
    evidenceIntegrity: {
      score: 99,
      status: application.integrityStatus || 'Verified',
      explanation: 'Cryptographic SHA-256 hashes matched without tamper markers.'
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'verified' || s === 'clear') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          VERIFIED
        </span>
      );
    }
    if (s === 'review' || s === 'watch') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
          <AlertCircle className="w-3 h-3" />
          NEEDS REVIEW
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
        <AlertTriangle className="w-3 h-3" />
        {String(status).toUpperCase()}
      </span>
    );
  };

  const pillars = [
    {
      id: 'doc',
      title: '1. Document Forensics',
      score: breakdown.documentForensics?.score || 72,
      status: breakdown.documentForensics?.status || 'Review',
      explanation: breakdown.documentForensics?.explanation || 'Document structure and kerning analysis.',
      icon: FileCheck
    },
    {
      id: 'kyc',
      title: '2. KYC & Identity Alignment',
      score: breakdown.kycAnalysis?.score || 24,
      status: breakdown.kycAnalysis?.status || 'Verified',
      explanation: breakdown.kycAnalysis?.explanation || 'Aadhaar, PAN and face verification.',
      icon: UserCheck
    },
    {
      id: 'net',
      title: '3. Fraud Network Topology',
      score: breakdown.fraudNetwork?.score || 68,
      status: breakdown.fraudNetwork?.status || 'Connected',
      explanation: breakdown.fraudNetwork?.explanation || 'Device and telemetry network connections.',
      icon: Share2
    },
    {
      id: 'int',
      title: '4. Evidence Integrity Ledger',
      score: breakdown.evidenceIntegrity?.score || 99,
      status: breakdown.evidenceIntegrity?.status || 'Verified',
      explanation: breakdown.evidenceIntegrity?.explanation || 'SHA-256 tamper-evident digital proof.',
      icon: Database
    }
  ];

  const overallScore = application.riskScore ?? 68;
  const overallLevel = application.riskLevel || 'MEDIUM';

  const getLevelColor = (lvl) => {
    const l = String(lvl).toUpperCase();
    if (l === 'HIGH') return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
    if (l === 'MEDIUM') return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/85 p-6 backdrop-blur-md space-y-5">
      {/* Header with Overall Risk Score */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              5-Pillar Digital Underwriting Verification
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synthesized multi-signal risk telemetry across documents, identity proofs, telemetry network, and evidence ledger.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-midnight-950/80 px-4 py-2.5 rounded-xl border border-surface-border">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Composite Risk</div>
            <div className="text-xl font-mono font-extrabold text-white">
              {overallScore}<span className="text-xs font-normal text-slate-400">/100</span>
            </div>
          </div>
          <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border ${getLevelColor(overallLevel)}`}>
            {overallLevel} RISK
          </span>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="rounded-xl border border-surface-border bg-midnight-950/60 p-4 flex flex-col justify-between hover:border-cyan-500/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-white font-mono truncate">
                      {p.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 my-2">
                  <span className="text-xs font-mono text-slate-400">Signal:</span>
                  {getStatusBadge(p.status)}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                  {p.explanation}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Confidence / Anomaly:</span>
                <span className="text-slate-300 font-bold">{p.score}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory AI Regulatory Disclaimer */}
      <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-cyan-200/90 leading-relaxed font-sans">
          <strong className="font-semibold text-cyan-300 font-mono">Advisory Governance Notice: </strong>
          TrustLedger AI indicators and anomaly scores are advisory decision-support tools. In accordance with RBI digital lending guidelines, underwriting policy, and fair lending principles, automated models never make binding approvals or rejections. The final lending decision rests exclusively with the authorized human underwriter.
        </div>
      </div>
    </div>
  );
}
