import React from 'react';
import { Settings, Sliders, Shield, Key, Bell, Database, Lock } from 'lucide-react';
import Button from '../components/common/Button';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-coffee-600">
          <span>SYSTEM</span>
          <span className="text-stone-400">/</span>
          <span className="text-stone-500">CONFIGURATION</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-espresso mt-1">
          Fraud Shield Governance & Settings
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Tune algorithmic risk cutoffs, HSM ledger keys, and lender integration endpoints
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Risk Cutoff Sliders */}
        <div className="lg:col-span-6 rounded-xl border border-coffee-200 bg-white p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-espresso font-semibold text-sm pb-3 border-b border-coffee-200">
            <Sliders className="h-4 w-4 text-coffee-600" />
            <span>Automated Triage Thresholds</span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between text-stone-700 font-medium mb-1">
                <span>Auto-Approve Cutoff (Max Score):</span>
                <span className="text-emerald-700 font-bold">&le; 25 / 100</span>
              </div>
              <input type="range" defaultValue={25} min={5} max={50} className="w-full accent-emerald-600" />
            </div>

            <div>
              <div className="flex justify-between text-stone-700 font-medium mb-1">
                <span>Human Review Trigger:</span>
                <span className="text-amber-700 font-bold">26 - 65 / 100</span>
              </div>
              <input type="range" defaultValue={65} min={40} max={80} className="w-full accent-amber-600" />
            </div>

            <div>
              <div className="flex justify-between text-stone-700 font-medium mb-1">
                <span>Hard Block / Auto-Reject Threshold:</span>
                <span className="text-red-700 font-bold">&ge; 66 / 100</span>
              </div>
              <input type="range" defaultValue={66} min={60} max={90} className="w-full accent-red-600" />
            </div>
          </div>
        </div>

        {/* Right: Security & Ledger Parameters */}
        <div className="lg:col-span-6 rounded-xl border border-coffee-200 bg-white p-6 space-y-4 font-mono text-xs shadow-sm">
          <div className="flex items-center gap-2 text-espresso font-semibold text-sm pb-3 border-b border-coffee-200">
            <Lock className="h-4 w-4 text-coffee-600" />
            <span>Cryptographic Anchoring Configuration</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-coffee-200 bg-warm-50">
              <div className="text-stone-500 text-[10px] uppercase font-semibold">Ledger Batching Cadence</div>
              <div className="text-espresso font-semibold mt-0.5">Every 100 Signatures or 60 Seconds</div>
            </div>

            <div className="p-3 rounded-lg border border-coffee-200 bg-warm-50">
              <div className="text-stone-500 text-[10px] uppercase font-semibold">Target Supabase PostgreSQL Instance</div>
              <div className="text-coffee-800 font-semibold mt-0.5">supabase.cloud/v1/trustledger-vault (Configured)</div>
            </div>

            <div className="p-3 rounded-lg border border-coffee-200 bg-warm-50">
              <div className="text-stone-500 text-[10px] uppercase font-semibold">FastAPI Perimeter Microservice</div>
              <div className="text-emerald-700 font-semibold mt-0.5">http://127.0.0.1:8000 (Connected)</div>
            </div>
          </div>

          <Button variant="primary" size="sm" className="w-full mt-2">
            Save Governance Policy
          </Button>
        </div>
      </div>
    </div>
  );
}
