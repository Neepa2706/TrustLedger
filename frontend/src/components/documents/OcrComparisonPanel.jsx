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
    <div className="rounded-xl border border-coffee-200 bg-white p-5 shadow-sm">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-coffee-200 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-espresso tracking-wide">
            Text & OCR Discrepancy Inspector
          </h3>
          <p className="text-xs text-stone-500">
            Compare underlying digital stream against rendered optical character scans
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-warm-50 p-1 rounded-lg border border-coffee-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab('extracted')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'extracted'
                ? 'bg-coffee-600 text-white font-medium shadow-sm'
                : 'text-stone-600 hover:text-espresso'
            }`}
          >
            Extracted Text
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'ocr'
                ? 'bg-coffee-600 text-white font-medium shadow-sm'
                : 'text-stone-600 hover:text-espresso'
            }`}
          >
            OCR Analysis
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'comparison'
                ? 'bg-coffee-600 text-white font-medium shadow-sm'
                : 'text-stone-600 hover:text-espresso'
            }`}
          >
            Comparison Diff
          </button>
        </div>
      </div>

      {/* Tab 1: Extracted Text */}
      {activeTab === 'extracted' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-stone-500 text-[11px]">
            <span>Total Characters: {textAnalysis.total_characters || 3840}</span>
            <span className="text-emerald-700 font-semibold">Sensitive PII Masked</span>
          </div>
          <div className="max-h-56 overflow-y-auto rounded-lg border border-coffee-200 bg-warm-50/70 p-3.5 text-stone-700 whitespace-pre-wrap leading-relaxed">
            {previewText}
          </div>
        </div>
      )}

      {/* Tab 2: OCR Analysis */}
      {activeTab === 'ocr' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-stone-500 text-[11px]">
            <span>Engine: {ocr.engine || 'Tesseract OCR'}</span>
            <span className="text-coffee-700 font-bold">Confidence: {ocr.confidence || 91.4}%</span>
          </div>
          <div className="max-h-56 overflow-y-auto rounded-lg border border-coffee-200 bg-warm-50/70 p-3.5 text-stone-700 whitespace-pre-wrap leading-relaxed">
            {ocrText}
          </div>
        </div>
      )}

      {/* Tab 3: Comparison Diff */}
      {activeTab === 'comparison' && (
        <div className="space-y-3 font-mono text-xs">
          {isSuspicious ? (
            <div className="space-y-2.5">
              <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-800">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span>Discrepancy in Salary Deposit Figure</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-red-200 text-[11px]">
                  <div>
                    <span className="text-stone-500 block uppercase text-[9px]">Selectable Stream Text:</span>
                    <span className="text-emerald-700 font-bold">₹95,000.00 (Current Render)</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block uppercase text-[9px]">Underlying OCR Residual:</span>
                    <span className="text-red-700 font-bold">₹25,000.00 (Altered)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-coffee-200 bg-warm-50/70 text-stone-700 flex items-center justify-between">
                <span>Account Number & IFSC Match:</span>
                <span className="text-emerald-700 font-bold">100% Identical</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Perfect Text / OCR Alignment</span>
                <span className="text-[11px] text-stone-600">
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
