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
    <div className={`rounded-xl border border-coffee-200 bg-white p-5 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-coffee-200">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-espresso tracking-wide">{documentName}</h3>
              <StatusBadge status="TAMPERED" size="sm" pulse />
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Subject: <span className="text-stone-700 font-medium">{applicant}</span> • Forensic Optical & Metadata Inspection
            </p>
          </div>
        </div>

        {/* Forensic Filter Switcher */}
        <div className="flex items-center bg-warm-50 p-1 rounded-lg border border-coffee-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab('tamper')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'tamper' ? 'bg-coffee-600 text-white font-semibold shadow-sm' : 'text-stone-600 hover:text-espresso'
            }`}
          >
            Forensic View
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'metadata' ? 'bg-coffee-600 text-white font-semibold shadow-sm' : 'text-stone-600 hover:text-espresso'
            }`}
          >
            XMP Metadata
          </button>
        </div>
      </div>

      {/* Main Inspection Canvas */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Visual Document Mockup with Tamper Overlays */}
        <div className="lg:col-span-7 rounded-lg border border-coffee-200 bg-warm-50/70 p-4 relative overflow-hidden flex flex-col justify-between min-h-[260px] shadow-inner">
          {/* Subtle Document Grid Lines */}
          <div className="cyber-grid absolute inset-0 opacity-5 pointer-events-none"></div>

          {/* Document Simulated Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-coffee-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-warm-100 border border-coffee-200 flex items-center justify-center font-mono text-[10px] text-coffee-800 font-bold">
                BK
              </div>
              <span className="text-xs font-mono font-medium text-stone-800">NATIONAL HORIZON BANK — STATEMENT</span>
            </div>
            <span className="text-[10px] font-mono text-stone-500">SHA-256: 3a9e...e7b1</span>
          </div>

          {/* Document Body Simulation with Highlighted Tamper Box */}
          <div className="relative z-10 my-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-stone-500 text-[11px] pb-1 border-b border-coffee-200">
              <span>TRANSACTION</span>
              <span>AMOUNT</span>
            </div>
            
            <div className="flex justify-between text-stone-700 text-[11px]">
              <span>ACH Payroll Transfer - Apex Logistics</span>
              <span className="text-stone-600">₹24,500.00</span>
            </div>

            {/* Tampered Line with Warning Bounding Box */}
            <div className="relative p-2 rounded border-2 border-dashed border-red-400 bg-red-50/80 flex justify-between items-center text-red-800 shadow-sm">
              <div className="flex items-center gap-2">
                <AlertOctagon className="h-3.5 w-3.5 text-red-600 shrink-0" />
                <span className="font-semibold text-xs">DIRECT DEPOSIT - CORP EXECUTIVE</span>
              </div>
              <span className="font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                +₹1,45,000.00 [MODIFIED]
              </span>
              
              {/* Bounding box badge */}
              <div className="absolute -top-2.5 right-3 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shadow-sm">
                Tamper Zone #1: Font Mismatch
              </div>
            </div>

            <div className="flex justify-between text-stone-700 text-[11px]">
              <span>Electric Utility Bill Auto-Debit</span>
              <span className="text-stone-600">-₹1,840.20</span>
            </div>
          </div>

          {/* Document Footer Bar */}
          <div className="relative z-10 flex items-center justify-between border-t border-coffee-200 pt-2 text-[10px] font-mono text-stone-500">
            <span>OCR Confidence: 98.4%</span>
            <span className="text-red-700 font-semibold">Integrity Verdict: REJECT</span>
          </div>
        </div>

        {/* Forensic Anomaly Report Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
          {anomalyFlags.map((flag) => (
            <div
              key={flag.id}
              className={`p-3 rounded-lg border text-xs shadow-sm ${
                flag.severity === 'critical'
                  ? 'border-red-200 bg-red-50/60 text-red-800'
                  : 'border-amber-200 bg-amber-50/60 text-amber-800'
              }`}
            >
              <div className="flex items-center justify-between font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <AlertOctagon className="h-3.5 w-3.5 text-red-600" />
                  {flag.title}
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-coffee-200 text-stone-600">
                  {flag.location}
                </span>
              </div>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {flag.detail}
              </p>
            </div>
          ))}

          <div className="p-3 rounded-lg border border-coffee-200 bg-warm-50 flex items-center justify-between text-xs font-mono shadow-sm">
            <span className="text-stone-600">Cryptographic Seal Status:</span>
            <span className="text-red-700 font-bold flex items-center gap-1">
              INVALID (Hash Mismatch)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
