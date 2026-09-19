/**
 * TrustLedger ApplicationStepper Component
 * Multi-step progress indicator for the 6-stage borrower loan application.
 * Styled in White & Coffee Brown fintech design system.
 */

import React from 'react';
import { CheckCircle2, User, FileSpreadsheet, Briefcase, FileText, CheckSquare, Send } from 'lucide-react';

export default function ApplicationStepper({ currentStep = 1, onStepClick }) {
  const steps = [
    { num: 1, label: 'Personal Details', icon: User },
    { num: 2, label: 'Loan Details', icon: FileSpreadsheet },
    { num: 3, label: 'Financial Details', icon: Briefcase },
    { num: 4, label: 'Documents', icon: FileText },
    { num: 5, label: 'Review', icon: CheckSquare },
    { num: 6, label: 'Ready to Submit', icon: Send }
  ];

  return (
    <div className="w-full mb-6">
      {/* Stepper Bar */}
      <div className="flex items-center justify-between relative">
        {/* Background connector line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-coffee-200 z-0" />

        {/* Progress active connector line */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-coffee-600 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((s) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          const isAccessible = s.num <= currentStep;

          return (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={!isAccessible || !onStepClick}
                onClick={() => isAccessible && onStepClick && onStepClick(s.num)}
                className={`h-9 w-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-sm cursor-pointer'
                    : isCurrent
                    ? 'bg-coffee-600 text-white ring-4 ring-coffee-100 shadow-sm cursor-default'
                    : 'bg-white border border-coffee-300 text-coffee-700 cursor-not-allowed'
                }`}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : s.num}
              </button>
              <span
                className={`text-[11px] mt-1.5 hidden md:block text-center whitespace-nowrap ${
                  isCurrent ? 'text-coffee-950 font-bold' : isDone ? 'text-coffee-800 font-semibold' : 'text-coffee-700 font-medium'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="md:hidden text-center mt-3">
        <span className="text-xs font-bold text-coffee-800">
          STEP {currentStep} OF {steps.length}: {steps[currentStep - 1].label}
        </span>
      </div>
    </div>
  );
}
