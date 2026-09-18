import React from 'react';
import { UserCheck, ShieldAlert, Fingerprint, Camera, CheckCircle2, AlertTriangle } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import RiskScoreRing from '../components/ui/RiskScoreRing';
import Button from '../components/common/Button';

export default function KycAnalysisPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>IDENTITY VERIFICATION</span>
            <span>/</span>
            <span className="text-slate-400">BIOMETRIC KYC</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Biometric & Identity Cross-Verification
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Passive 3D liveness detection, deepfake facial analysis, and synthetic identity reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={Camera}>
            Request Liveness Re-Scan
          </Button>
        </div>
      </div>

      {/* KYC Inspector Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Biometric Confidence Card */}
        <div className="lg:col-span-5 rounded-xl border border-surface-border bg-surface-card p-6 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between pb-3 border-b border-surface-border">
            <h3 className="text-sm font-semibold text-white">Biometric Liveness Verdict</h3>
            <StatusBadge status="SAFE" customLabel="PASS (99.8%)" size="sm" />
          </div>

          <div className="my-6">
            <RiskScoreRing
              score={14}
              size={160}
              label="Synthetic Identity Risk: LOW"
            />
          </div>

          <div className="w-full space-y-2 text-xs font-mono text-slate-300">
            <div className="flex justify-between p-2 rounded bg-midnight-950 border border-surface-border">
              <span className="text-slate-400">Facial Texture Depth:</span>
              <span className="text-emerald-400 font-bold">Natural Skin (3D)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-midnight-950 border border-surface-border">
              <span className="text-slate-400">Deepfake Artifact Probability:</span>
              <span className="text-emerald-400 font-bold">0.02%</span>
            </div>
          </div>
        </div>

        {/* Right: Government ID & Cross-Referenced Database Signals */}
        <div className="lg:col-span-7 rounded-xl border border-surface-border bg-surface-card p-6 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-semibold text-white font-sans">Identity Signal Reconciler</h3>
          <p className="text-slate-400 text-xs font-sans">
            Cross-checking authoritative credit bureaus, death master files, and device identifiers:
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>SSN Issuance Window Match (DOB Consistency)</span>
              </div>
              <span className="font-bold">VERIFIED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>SSA Death Master File Check</span>
              </div>
              <span className="font-bold">CLEARED (ACTIVE)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-surface-border bg-midnight-950 text-slate-300">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-cyan-400" />
                <span>Driver License Barcode Holographic Pattern</span>
              </div>
              <span className="text-cyan-400 font-bold">AAMVA VALIDATED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
