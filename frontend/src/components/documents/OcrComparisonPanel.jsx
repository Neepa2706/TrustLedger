import React, { useState } from 'react';
import { FileText, Cpu, GitCompare, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function OcrComparisonPanel({
  textAnalysis = {},
  ocr = {},
  isSuspicious = false
}) {
  const [activeTab, setActiveTab] = useState('extracted');

  const previewText = textAnalysis.extracted_text_preview ||
    "STATE BANK OF INDIA - STATEMENT OF ACCOUNT\nAccount No: •••••••• 4821\nCustomer: Rahul Verma\nAddress: Sector 14, Gurugram, Haryana\nTransaction Details:\n02 May: SALARY CREDIT CORP: ₹95,000.00\n05 May: UPI/SWIGGY: -₹640.00\n10 May: ELECTRICITY BILL: -₹2,150.00\nClosing Balance: ₹1,48,200.00";

  const ocrText = ocr.text ||
    "STATE BANK OF INDIA - STATEMENT OF ACCOUNT\nName: Rahul Verma\nNet Monthly Credit: ₹95,000.00\nClosing Balance: ₹1,48,200.00\nOCR Engine: Tesseract 5.3 (Confidence: 91.4%)";

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-border mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Text & OCR Discrepancy Inspector
          </h3>
          <p className="text-xs text-slate-400">
            Compare underlying digital stream against rendered optical character scans
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-midnight-950 p-1 rounded-lg border border-surface-border text-xs font-mono">
          <button
            onClick={() => setActiveTab('extracted')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'extracted'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Extracted Text
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'ocr'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            OCR Analysis
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'comparison'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Comparison Diff
          </button>
        </div>
      </div>

      {/* Tab 1: Extracted Text */}
      {activeTab === 'extracted' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Total Characters: {textAnalysis.total_characters || 3840}</span>
            <span className="text-emerald-400">Sensitive PII Masked</span>
          </div>
          <div className="max-h-56 overflow-y-auto rounded-lg border border-surface-border bg-midnight-950 p-3.5 text-slate-300 whitespace-pre-wrap leading-relaxed">
            {previewText}
          </div>
        </div>
      )}

      {/* Tab 2: OCR Analysis */}
      {activeTab === 'ocr' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Engine: {ocr.engine || 'Tesseract OCR'}</span>
            <span className="text-cyan-300 font-bold">Confidence: {ocr.confidence || 91.4}%</span>
          </div>
          <div className="max-h-56 overflow-y-auto rounded-lg border border-surface-border bg-midnight-950 p-3.5 text-slate-300 whitespace-pre-wrap leading-relaxed">
            {ocrText}
          </div>
        </div>
      )}

      {/* Tab 3: Comparison Diff */}
      {activeTab === 'comparison' && (
        <div className="space-y-3 font-mono text-xs">
          {isSuspicious ? (
            <div className="space-y-2.5">
              <div className="p-3 rounded-lg border border-red-500/30 bg-red-950/20 text-red-200">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span>Discrepancy in Salary Deposit Figure</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-red-900/50 text-[11px]">
                  <div>
                    <span className="text-slate-400 block uppercase text-[9px]">Selectable Stream Text:</span>
                    <span className="text-emerald-300 font-bold">₹95,000.00 (Current Render)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase text-[9px]">Underlying OCR Residual:</span>
                    <span className="text-red-400 font-bold">₹25,000.00 (Altered)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-surface-border bg-midnight-950 text-slate-300 flex items-center justify-between">
                <span>Account Number & IFSC Match:</span>
                <span className="text-emerald-400 font-bold">100% Identical</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block">Perfect Text / OCR Alignment</span>
                <span className="text-[11px] text-slate-300">
                  Selectable digital stream and optical character pass match across all financial figures.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
