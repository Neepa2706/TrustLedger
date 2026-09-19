import React from 'react';
import RiskScoreRing from '../ui/RiskScoreRing';
import { FileText, UserCheck, Share2, Database, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function RiskBreakdown({ application }) {
  const breakdown = application.riskBreakdown || {
    documentForensics: { score: 87, status: 'Suspicious', explanation: 'Potential formatting and metadata anomalies detected.' },
    kycAnalysis: { score: 64, status: 'Review', explanation: 'Video requires additional liveness review.' },
    fraudNetwork: { score: 91, status: 'Connected', explanation: 'Multiple connected digital signals detected.' },
    evidenceIntegrity: { score: 28, status: 'Warning', explanation: 'Current evidence fingerprint requires verification.' }
  };

  const components = [
    {
      id: 'doc',
      name: 'Document Forensics',
      score: breakdown.documentForensics.score,
      status: breakdown.documentForensics.status,
      explanation: breakdown.documentForensics.explanation,
      icon: FileText,
      isWarning: breakdown.documentForensics.score > 60
    },
    {
      id: 'kyc',
      name: 'KYC Analysis',
      score: breakdown.kycAnalysis.score,
      status: breakdown.kycAnalysis.status,
      explanation: breakdown.kycAnalysis.explanation,
      icon: UserCheck,
      isWarning: breakdown.kycAnalysis.score > 60
    },
    {
      id: 'net',
      name: 'Fraud Network',
      score: breakdown.fraudNetwork.score,
      status: breakdown.fraudNetwork.status,
      explanation: breakdown.fraudNetwork.explanation,
      icon: Share2,
      isWarning: breakdown.fraudNetwork.score > 60
    },
    {
      id: 'int',
      name: 'Evidence Integrity',
      score: breakdown.evidenceIntegrity.score,
      status: breakdown.evidenceIntegrity.status,
      explanation: breakdown.evidenceIntegrity.explanation,
      icon: Database,
      isWarning: breakdown.evidenceIntegrity.status === 'Warning'
    }
  ];

  const getProgressColor = (score, isWarning) => {
    if (isWarning || score > 65) return 'bg-rose-500';
    if (score > 35) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-coffee-100 mb-6">
        <div>
          <h2 className="text-base font-semibold text-espresso tracking-wide">
            Risk Assessment Breakdown
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Synthetic triage scoring evaluating multi-channel forensic signals
          </p>
        </div>
        <span className="text-[11px] font-mono text-coffee-800 bg-warm-100 px-2.5 py-1 rounded-full border border-coffee-200 font-semibold">
          AI-ASSISTED TRIAGE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Overall Risk Dial */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl border border-coffee-200 bg-warm-50/70 shadow-xs">
          <RiskScoreRing
            score={application.riskScore}
            size={160}
            strokeWidth={12}
            label={`OVERALL RISK: ${application.riskScore}% (${application.riskLevel})`}
          />
          <div className="mt-3 text-center">
            <span className="text-[11px] font-mono text-stone-500 font-medium">
              Composite Risk Index
            </span>
          </div>
        </div>

        {/* Right: 4 Component Progress Bars with Explanations */}
        <div className="lg:col-span-8 space-y-4">
          {components.map((c) => {
            const Icon = c.icon;
            const progressColor = getProgressColor(c.score, c.isWarning);

            return (
              <div
                key={c.id}
                className="rounded-xl border border-coffee-200 bg-warm-50/60 p-3.5 transition-all hover:border-coffee-400 hover:bg-white shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-coffee-700" />
                    <span className="text-xs font-semibold text-espresso font-mono">
                      {c.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-espresso font-bold">
                      {typeof c.score === 'number' ? `${c.score}%` : c.status}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                      c.isWarning
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-coffee-100 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
                    style={{ width: `${Math.min(c.score || 70, 100)}%` }}
                  />
                </div>

                {/* Explanation text */}
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {c.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
