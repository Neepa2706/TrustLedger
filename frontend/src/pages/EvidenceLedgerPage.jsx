import React from 'react';
import { Database, Lock, Hash, ShieldCheck, CheckCircle2, Download, Search } from 'lucide-react';
import EvidenceIntegrityIndicator from '../components/ui/EvidenceIntegrityIndicator';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/common/Button';

const ledgerBlocks = [
  {
    block: 49821,
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    prevHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    txCount: 64,
    timestamp: '2026-09-18 18:52:04 UTC',
    status: 'SEALED'
  },
  {
    block: 49820,
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    prevHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    txCount: 128,
    timestamp: '2026-09-18 18:42:15 UTC',
    status: 'SEALED'
  },
  {
    block: 49819,
    hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    prevHash: '35a92a54902b781878b277b02db74cb3efaeabf91ba632b4b41efc1b48b1bfb9',
    txCount: 96,
    timestamp: '2026-09-18 18:32:00 UTC',
    status: 'SEALED'
  }
];

export default function EvidenceLedgerPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>CRYPTOGRAPHIC AUDIT</span>
            <span>/</span>
            <span className="text-slate-400">TAMPER-EVIDENT LEDGER</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Immutable Evidence Audit Chain
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Every loan application, document hash, and decision audit log is permanently sealed
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={Download}>
            Download Full Merkle Proof
          </Button>
        </div>
      </div>

      {/* Primary Seal Display */}
      <EvidenceIntegrityIndicator
        hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        blockNumber={49821}
        verified={true}
        timestamp="2026-09-18 18:52:04 UTC"
        signer="TrustLedger Sentinel HSM #4"
      />

      {/* Ledger Block Explorer */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-border">
          <h3 className="text-sm font-semibold text-white">Anchored Ledger Blocks</h3>
          <span className="text-xs font-mono text-slate-400">Chain Height: #49821</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {ledgerBlocks.map((b) => (
            <div key={b.block} className="p-3.5 rounded-lg border border-surface-border bg-midnight-950 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                  #{b.block.toString().slice(-3)}
                </div>
                <div>
                  <div className="text-white font-semibold flex items-center gap-2">
                    <span>Block #{b.block}</span>
                    <StatusBadge status="SAFE" customLabel={b.status} size="sm" />
                  </div>
                  <div className="text-slate-400 text-[11px] truncate max-w-sm sm:max-w-md">
                    Hash: {b.hash}
                  </div>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                <div>{b.txCount} Evidence Signatures</div>
                <div className="text-slate-500">{b.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
