import React from 'react';
import { Eye, CheckCircle2, AlertTriangle, ShieldCheck, AlertOctagon, HelpCircle } from 'lucide-react';

export default function VisualAnalysisPanel({
  visualSignals = {},
  riskScore = 87,
  recommendedAction = 'Review original source document before making a lending decision.'
}) {
  const metrics = [
    { label: 'Layout Consistency', value: visualSignals.layout_consistency ?? 68 },
    { label: 'Font Baseline Match', value: visualSignals.font_consistency ?? 42 },
    { label: 'OCR Alignment Pass', value: visualSignals.ocr_consistency ?? 55 }
  ];

  const isHighRisk = riskScore > 65;

  const getColor = (val) => {
    if (val < 50) return 'bg-red-500 text-red-700';
    if (val < 75) return 'bg-amber-500 text-amber-700';
    return 'bg-emerald-500 text-emerald-700';
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Visual Metrics Container */}
      <div className="rounded-xl border border-coffee-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-coffee-200 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-espresso tracking-wide">
              Visual & Structural Signals
            </h3>
            <p className="text-xs text-stone-500">
              Prototype heuristic scan across text layout and embedded graphics
            </p>
          </div>
          <span className="text-[10px] text-coffee-700 bg-warm-50 px-2 py-0.5 rounded border border-coffee-200 font-semibold">
            PROTOTYPE SCAN
          </span>
        </div>

        <div className="space-y-3">
          {metrics.map((m, idx) => {
            const color = getColor(m.value);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-stone-700 font-medium">
                  <span>{m.label}</span>
                  <span className="font-bold text-espresso">{m.value}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${color.split(' ')[0]}`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-coffee-200 flex items-center justify-between text-[11px] text-stone-500">
          <span>Image Regions Analyzed: <span className="text-espresso font-bold">{visualSignals.image_regions_analyzed || 4}</span></span>
          <span>Suspicious Flags: <span className={isHighRisk ? 'text-red-700 font-bold' : 'text-emerald-700 font-bold'}>{visualSignals.suspicious_regions || (isHighRisk ? 1 : 0)}</span></span>
        </div>
      </div>

      {/* Recommended Action Summary Card */}
      <div className={`rounded-xl border p-5 shadow-sm ${
        isHighRisk
          ? 'border-red-200 bg-red-50 text-red-800'
          : 'border-emerald-200 bg-emerald-50 text-emerald-800'
      }`}>
        <div className="flex items-start gap-3">
          {isHighRisk ? (
            <AlertOctagon className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h4 className={`font-bold text-xs ${isHighRisk ? 'text-red-900' : 'text-emerald-900'}`}>
              {isHighRisk ? 'Analysis Summary: Underwriter Review Advised' : 'Analysis Summary: Low Risk'}
            </h4>
            <p className="text-[11px] text-stone-700 leading-relaxed">
              {recommendedAction}
            </p>
            <div className="pt-2 text-[10px] text-stone-500 font-normal">
              Note: This AI-assisted signal is indicative and does not constitute conclusive legal determination of fraud.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
