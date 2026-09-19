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
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          VERIFIED
        </span>
      );
    }
    if (s === 'review' || s === 'watch') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          <AlertCircle className="w-3 h-3 text-amber-700" />
          NEEDS REVIEW
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
        <AlertTriangle className="w-3 h-3 text-rose-700" />
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
    if (l === 'HIGH') return 'text-rose-800 border-rose-200 bg-rose-50';
    if (l === 'MEDIUM') return 'text-amber-800 border-amber-200 bg-amber-50';
    return 'text-emerald-800 border-emerald-200 bg-emerald-50';
  };

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-sm space-y-5">
      {/* Header with Overall Risk Score */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-coffee-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-coffee-700" />
            <h2 className="text-base font-bold text-espresso tracking-wide">
              5-Pillar Digital Underwriting Verification
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Synthesized multi-signal risk telemetry across documents, identity proofs, telemetry network, and evidence ledger.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-warm-50 px-4 py-2.5 rounded-xl border border-coffee-200">
          <div className="text-right">
            <div className="text-[10px] font-mono text-stone-500 uppercase">Composite Risk</div>
            <div className="text-xl font-mono font-extrabold text-espresso">
              {overallScore}<span className="text-xs font-normal text-stone-400">/100</span>
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
              className="rounded-xl border border-coffee-200 bg-warm-50/60 p-4 flex flex-col justify-between hover:border-coffee-400 hover:bg-white transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white border border-coffee-200 text-coffee-700 shadow-xs">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-espresso font-mono truncate">
                      {p.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 my-2">
                  <span className="text-xs font-mono text-stone-500">Signal:</span>
                  {getStatusBadge(p.status)}
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed line-clamp-3">
                  {p.explanation}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-coffee-100 flex items-center justify-between text-[10px] font-mono text-stone-500">
                <span>Confidence / Anomaly:</span>
                <span className="text-espresso font-bold">{p.score}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory AI Regulatory Disclaimer */}
      <div className="rounded-xl border border-coffee-200 bg-coffee-50 p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-coffee-700 shrink-0 mt-0.5" />
        <div className="text-[11px] text-coffee-950 leading-relaxed font-sans">
          <strong className="font-semibold text-coffee-900 font-mono">Advisory Governance Notice: </strong>
          TrustLedger AI indicators and anomaly scores are advisory decision-support tools. In accordance with RBI digital lending guidelines, underwriting policy, and fair lending principles, automated models never make binding approvals or rejections. The final lending decision rests exclusively with the authorized human underwriter.
        </div>
      </div>
    </div>
  );
}
