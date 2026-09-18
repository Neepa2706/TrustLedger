import React from 'react';
import { FileText, AlertOctagon, ZoomIn, Eye, ShieldCheck, Hash } from 'lucide-react';

export default function DocumentPreviewCanvas({
  document,
  selectedFinding,
  onSelectFinding
}) {
  if (!document) {
    return (
      <div className="rounded-xl border border-surface-border bg-midnight-950/80 p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
        <FileText className="h-10 w-10 text-slate-600 mb-2" />
        <span className="text-xs text-slate-400 font-mono">Select a document to render forensic preview</span>
      </div>
    );
  }

  const findingsWithBbox = (document.findings || []).filter(f => f.bbox);
  const isSuspicious = document.risk_score > 65;

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm flex flex-col justify-between">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-white truncate max-w-[220px]">
            {document.filename}
          </span>
          <span className="text-[10px] text-slate-400 bg-midnight-950 px-2 py-0.5 rounded border border-surface-border">
            {document.document_type}
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Page 1 of {document.metadata?.page_count || 1}
        </span>
      </div>

      {/* Visual Rendered Document Sheet Container */}
      <div className="relative rounded-lg border border-surface-border bg-midnight-950 p-6 min-h-[380px] overflow-hidden flex flex-col justify-between shadow-inner">
        {/* Subtle security document grid overlay */}
        <div className="cyber-grid absolute inset-0 opacity-15 pointer-events-none" />

        {/* Bank Document Simulated Header */}
        <div className="relative z-10 border-b border-slate-800 pb-3 flex items-start justify-between font-mono text-xs">
          <div>
            <div className="text-cyan-300 font-bold tracking-wide">
              STATE BANK OF INDIA — ACCOUNT STATEMENT
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              BRANCH: GURUGRAM SECTOR-14 • IFSC: SBIN0001428
            </div>
            <div className="text-[10px] text-slate-400">
              HOLDER: {document.application_id === 'APP-1003' ? 'RAHUL VERMA' : 'ARJUN MEHTA'}
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-500">
            <div>STATEMENT PERIOD</div>
            <div className="text-slate-300">01-MAY-2026 TO 31-MAY-2026</div>
          </div>
        </div>

        {/* Transactions Table Preview */}
        <div className="relative z-10 my-4 space-y-2 font-mono text-xs">
          <div className="flex justify-between text-[10px] uppercase text-slate-500 pb-1 border-b border-slate-800/80">
            <span>TRANSACTION PARTICULARS</span>
            <span>CHQ/REF NO</span>
            <span className="text-right">AMOUNT (₹)</span>
          </div>

          <div className="flex justify-between text-slate-300 text-[11px]">
            <span>Opening Balance b/f</span>
            <span className="text-slate-500">--</span>
            <span className="text-right">₹48,200.00</span>
          </div>

          <div className="flex justify-between text-slate-300 text-[11px]">
            <span>UPI/P2M Merchant Swiggy</span>
            <span className="text-slate-500">UPI/582910</span>
            <span className="text-right text-slate-400">-₹640.00</span>
          </div>

          <div className="flex justify-between text-slate-300 text-[11px]">
            <span>NEFT Transfer Electricity Bill</span>
            <span className="text-slate-500">NEFT/902144</span>
            <span className="text-right text-slate-400">-₹2,150.00</span>
          </div>

          {/* Tampered / Suspicious Highlight Row (Interactive Bounding Box) */}
          {isSuspicious ? (
            <div
              onClick={() => onSelectFinding && onSelectFinding(findingsWithBbox[0])}
              className={`relative cursor-pointer p-2.5 rounded border-2 transition-all ${
                selectedFinding?.type === 'formatting' || selectedFinding?.id === 'f-1'
                  ? 'border-red-400 bg-red-950/60 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                  : 'border-dashed border-red-500/80 bg-red-950/30 hover:border-red-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  <span className="font-semibold text-red-200">
                    ACH SALARY CREDIT - CORP EXEC
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">NEFT/CORP/982</span>
                  <span className="font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/50">
                    +₹95,000.00
                  </span>
                </div>
              </div>

              {/* Bounding Box Floating Anomaly Tag */}
              <div className="absolute -top-2.5 right-4 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider">
                FLAGGED REGION: FONT & OCR DISCREPANCY
              </div>
            </div>
          ) : (
            <div className="flex justify-between text-slate-300 text-[11px] p-1.5 rounded bg-emerald-950/20 border border-emerald-500/20">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                ACH SALARY CREDIT - TECHCORP INDIA
              </span>
              <span className="text-slate-500">NEFT/TC/881</span>
              <span className="text-right text-emerald-400 font-bold">+₹85,400.00</span>
            </div>
          )}

          <div className="flex justify-between text-slate-300 text-[11px]">
            <span>ATM Cash Withdrawal</span>
            <span className="text-slate-500">ATM/00912</span>
            <span className="text-right text-slate-400">-₹5,000.00</span>
          </div>

          <div className="flex justify-between text-slate-200 font-bold text-xs pt-2 border-t border-slate-800">
            <span>Closing Available Balance</span>
            <span></span>
            <span className="text-right text-cyan-300">
              {isSuspicious ? '₹1,35,410.00' : '₹1,25,810.00'}
            </span>
          </div>
        </div>

        {/* Footer Audit Seal */}
        <div className="relative z-10 border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3 text-cyan-400" />
            <span>SHA-256 Digest Verified</span>
          </div>
          <span className={isSuspicious ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
            {isSuspicious ? 'FORENSIC ANOMALIES DETECTED' : 'CLEAN AUDIT'}
          </span>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-slate-400 font-mono flex items-center justify-between">
        <span>Click on the flagged region to view forensic rationale</span>
        <span className="text-cyan-400">Zoom: 100% (Fit Width)</span>
      </div>
    </div>
  );
}
