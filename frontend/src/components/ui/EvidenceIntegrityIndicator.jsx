import React, { useState } from 'react';
import { ShieldCheck, Lock, Copy, Check, Hash, Cpu, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function EvidenceIntegrityIndicator({
  hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  blockNumber = 49821,
  verified = true,
  timestamp = '2026-09-18 18:50:12 UTC',
  signer = 'TrustLedger Guard HSM #4',
  className = ''
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedHash = `${hash.slice(0, 10)}...${hash.slice(-10)}`;

  return (
    <div className={`rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${
            verified ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-red-950/40 border-red-500/40 text-red-400'
          }`}>
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">Evidence Ledger Seal</h4>
            <p className="text-xs text-slate-400">Cryptographically anchored audit trail verification</p>
          </div>
        </div>

        <StatusBadge
          status={verified ? 'SAFE' : 'CRITICAL'}
          customLabel={verified ? 'IMMUTABLE & VERIFIED' : 'SEAL COMPROMISED'}
          size="sm"
        />
      </div>

      <div className="mt-4 space-y-3">
        {/* Hash Container */}
        <div className="flex items-center justify-between rounded-lg border border-surface-border bg-midnight-950 px-3 py-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Hash className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">{hash}</span>
            <span className="inline sm:hidden">{truncatedHash}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-midnight-900 px-2 py-1 rounded border border-surface-border transition-colors shrink-0"
            title="Copy SHA-256 hash"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Verification Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs font-mono">
          <div className="rounded border border-surface-border bg-midnight-900/50 p-2">
            <div className="text-[10px] text-slate-400 uppercase">Block Height</div>
            <div className="text-slate-200 font-semibold mt-0.5">#{blockNumber}</div>
          </div>

          <div className="rounded border border-surface-border bg-midnight-900/50 p-2">
            <div className="text-[10px] text-slate-400 uppercase">Seal Authority</div>
            <div className="text-slate-200 font-semibold mt-0.5 truncate">{signer}</div>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded border border-surface-border bg-midnight-900/50 p-2">
            <div className="text-[10px] text-slate-400 uppercase">Anchored At</div>
            <div className="text-slate-200 font-semibold mt-0.5 truncate">{timestamp}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
