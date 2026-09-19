import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ShieldAlert, Fingerprint, Camera, CheckCircle2, AlertTriangle, ArrowRight, FileText } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import RiskScoreRing from '../components/ui/RiskScoreRing';
import Button from '../components/common/Button';

export default function KycAnalysisPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-coffee-600">
            <span>IDENTITY VERIFICATION</span>
            <span className="text-stone-400">/</span>
            <span className="text-stone-500">BIOMETRIC KYC</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-espresso mt-1">
            Biometric & Identity Cross-Verification
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Passive 3D liveness detection, deepfake facial analysis, and synthetic identity reconciliation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/applications/TL-APP-10001')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 text-xs font-mono font-bold shadow-xs transition"
          >
            <span>Direct to Loan Application Details</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/applications')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-coffee-200 bg-white hover:bg-coffee-50 text-coffee-800 px-3.5 py-2 text-xs font-mono transition"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Loan Applications</span>
          </button>
          <Button variant="outline" size="sm" icon={Camera}>
            Request Liveness Re-Scan
          </Button>
        </div>
      </div>

      {/* KYC Inspector Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Biometric Confidence Card */}
        <div className="lg:col-span-5 rounded-xl border border-coffee-200 bg-white p-6 shadow-sm flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between pb-3 border-b border-coffee-200">
            <h3 className="text-sm font-semibold text-espresso">Biometric Liveness Verdict</h3>
            <StatusBadge status="SAFE" customLabel="PASS (99.8%)" size="sm" />
          </div>

          <div className="my-6">
            <RiskScoreRing
              score={14}
              size={160}
              label="Synthetic Identity Risk: LOW"
            />
          </div>

          <div className="w-full space-y-2 text-xs font-mono text-stone-700">
            <div className="flex justify-between p-2 rounded bg-warm-50 border border-coffee-200">
              <span className="text-stone-500">Facial Texture Depth:</span>
              <span className="text-emerald-700 font-bold">Natural Skin (3D)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-warm-50 border border-coffee-200">
              <span className="text-stone-500">Deepfake Artifact Probability:</span>
              <span className="text-emerald-700 font-bold">0.02%</span>
            </div>
          </div>
        </div>

        {/* Right: Government ID & Cross-Referenced Database Signals */}
        <div className="lg:col-span-7 rounded-xl border border-coffee-200 bg-white p-6 space-y-4 font-mono text-xs shadow-sm">
          <h3 className="text-sm font-semibold text-espresso font-sans">Identity Signal Reconciler</h3>
          <p className="text-stone-500 text-xs font-sans">
            Cross-checking authoritative credit bureaus, death master files, and device identifiers:
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>SSN Issuance Window Match (DOB Consistency)</span>
              </div>
              <span className="font-bold">VERIFIED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>SSA Death Master File Check</span>
              </div>
              <span className="font-bold">CLEARED (ACTIVE)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-coffee-200 bg-warm-50 text-stone-700">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-coffee-600" />
                <span>Driver License Barcode Holographic Pattern</span>
              </div>
              <span className="text-coffee-700 font-bold">AAMVA VALIDATED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
