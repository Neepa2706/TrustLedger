import React, { useState } from 'react';
import { FileText, AlertOctagon, CheckCircle2, Search, Sliders, Eye, FileCode2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function DocumentAnalysisPlaceholder({
  documentName = 'Bank_Statement_May2026.pdf',
  applicant = 'Marcus Vance',
  className = ''
}) {
  const [activeTab, setActiveTab] = useState('tamper');

  const anomalyFlags = [
    {
      id: 'flag-1',
      title: 'Font Embedding Discrepancy',
      detail: 'Helvetica Neue font subset spliced on page 2 line 14 (Salary Deposit entry: $14,500.00).',
      severity: 'critical',
      location: 'P2:L14'
    },
    {
      id: 'flag-2',
      title: 'PDF Producer Inconsistency',
      detail: 'Metadata indicates "Adobe Photoshop 24.1 (Windows)" rather than standard banking CorePDF export engine.',
      severity: 'critical',
      location: 'Header / XMP'
    },
    {
      id: 'flag-3',
      title: 'Pixel Grid Alignment Variance',
      detail: 'JPEG compression artifacts around bank logo indicate cut-and-paste overlay.',
      severity: 'warning',
      location: 'Top Banner'
    }
  ];

  return (
    <div className={`rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-wide">{documentName}</h3>
              <StatusBadge status="TAMPERED" size="sm" pulse />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Subject: <span className="text-slate-300 font-medium">{applicant}</span> • Forensic Optical & Metadata Inspection
            </p>
          </div>
        </div>

        {/* Forensic Filter Switcher */}
        <div className="flex items-center bg-midnight-950 p-1 rounded-lg border border-surface-border text-xs font-mono">
          <button
            onClick={() => setActiveTab('tamper')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'tamper' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Forensic View
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'metadata' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            XMP Metadata
          </button>
        </div>
      </div>

      {/* Main Inspection Canvas */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Visual Document Mockup with Tamper Overlays */}
        <div className="lg:col-span-7 rounded-lg border border-surface-border bg-midnight-950 p-4 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
          {/* Subtle Document Grid Lines */}
          <div className="cyber-grid absolute inset-0 opacity-20 pointer-events-none"></div>

          {/* Document Simulated Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-400">
                BK
              </div>
              <span className="text-xs font-mono font-medium text-slate-300">NATIONAL HORIZON BANK — STATEMENT</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">SHA-256: 3a9e...e7b1</span>
          </div>

          {/* Document Body Simulation with Highlighted Tamper Box */}
          <div className="relative z-10 my-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800/60">
              <span>TRANSACTION</span>
              <span>AMOUNT</span>
            </div>
            
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>ACH Payroll Transfer - Apex Logistics</span>
              <span className="text-slate-300">$2,450.00</span>
            </div>

            {/* Tampered Line with Warning Bounding Box */}
            <div className="relative p-2 rounded border-2 border-dashed border-red-500/80 bg-red-950/30 flex justify-between items-center text-red-200">
              <div className="flex items-center gap-2">
                <AlertOctagon className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span className="font-semibold text-xs">DIRECT DEPOSIT - CORP EXECUTIVE</span>
              </div>
              <span className="font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/50">
                +$14,500.00 [MODIFIED]
              </span>
              
              {/* Bounding box badge */}
              <div className="absolute -top-2.5 right-3 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                Tamper Zone #1: Font Mismatch
              </div>
            </div>

            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Electric Utility Bill Auto-Debit</span>
              <span className="text-slate-300">-$184.20</span>
            </div>
          </div>

          {/* Document Footer Bar */}
          <div className="relative z-10 flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] font-mono text-slate-400">
            <span>OCR Confidence: 98.4%</span>
            <span className="text-red-400 font-semibold">Integrity Verdict: REJECT</span>
          </div>
        </div>

        {/* Forensic Anomaly Report Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
          {anomalyFlags.map((flag) => (
            <div
              key={flag.id}
              className={`p-3 rounded-lg border text-xs ${
                flag.severity === 'critical'
                  ? 'border-red-500/30 bg-red-950/20 text-red-200'
                  : 'border-amber-500/30 bg-amber-950/20 text-amber-200'
              }`}
            >
              <div className="flex items-center justify-between font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <AlertOctagon className="h-3.5 w-3.5 text-red-400" />
                  {flag.title}
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-midnight-950 border border-slate-700/50 text-slate-400">
                  {flag.location}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {flag.detail}
              </p>
            </div>
          ))}

          <div className="p-3 rounded-lg border border-surface-border bg-midnight-900/60 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Cryptographic Seal Status:</span>
            <span className="text-red-400 font-bold flex items-center gap-1">
              INVALID (Hash Mismatch)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
