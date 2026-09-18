/**
 * TrustLedger EMICalculator Component
 * Interactive Indian EMI calculator with amount and duration sliders,
 * standard mathematical calculation, visual breakdown, and explicit disclaimer.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calculator, Info, Sparkles, AlertCircle } from 'lucide-react';
import { calculateEstimatedEmi } from '../../data/loanProductsData';

export default function EMICalculator({
  initialAmount = 150000,
  minAmount = 25000,
  maxAmount = 500000,
  initialDuration = 24,
  minDuration = 6,
  maxDuration = 36,
  interestRate = 14.5,
  onValuesChange
}) {
  const [amount, setAmount] = useState(initialAmount);
  const [duration, setDuration] = useState(initialDuration);

  const { emi, totalRepayment, totalInterest } = useMemo(() => {
    return calculateEstimatedEmi(amount, interestRate, duration);
  }, [amount, duration, interestRate]);

  useEffect(() => {
    if (onValuesChange) {
      onValuesChange({ amount, duration, emi, totalRepayment, totalInterest });
    }
  }, [amount, duration, emi, totalRepayment, totalInterest]);

  // Chart data for visual breakdown
  const chartData = [
    { name: 'Principal Amount', value: amount, color: '#00f0ff' },
    { name: 'Total Interest', value: totalInterest, color: '#38bdf8' }
  ];

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Estimated EMI Calculator</h3>
            <span className="text-[10px] font-mono text-cyan-400">
              Annual Interest Rate: {interestRate}% p.a.
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
          Interactive Estimate
        </span>
      </div>

      {/* Sliders & Inputs */}
      <div className="space-y-5">
        
        {/* Loan Amount */}
        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="text-slate-300 font-mono uppercase tracking-wider">
              Loan Amount
            </span>
            <span className="text-base font-bold text-cyan-300 font-mono">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min={minAmount}
            max={maxAmount}
            step={5000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-midnight-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>Min: ₹{minAmount.toLocaleString('en-IN')}</span>
            <span>Max: ₹{maxAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Duration Tenure */}
        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="text-slate-300 font-mono uppercase tracking-wider">
              Repayment Duration
            </span>
            <span className="text-base font-bold text-white font-mono">
              {duration} Months ({Math.floor(duration / 12)}y {duration % 12}m)
            </span>
          </div>
          <input
            type="range"
            min={minDuration}
            max={maxDuration}
            step={3}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-2 bg-midnight-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>{minDuration} Months</span>
            <span>{maxDuration} Months</span>
          </div>
        </div>

      </div>

      {/* Results Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        
        {/* Estimated Monthly EMI Card */}
        <div className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-midnight-950 text-center flex flex-col justify-center shadow-[0_0_15px_rgba(0,240,255,0.1)]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">
            Estimated Monthly EMI
          </span>
          <span className="text-xl sm:text-2xl font-bold text-white font-mono">
            ₹{emi.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 mt-1">/ month</span>
        </div>

        {/* Total Interest Card */}
        <div className="p-4 rounded-xl border border-surface-border bg-midnight-950 text-center flex flex-col justify-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Total Estimated Interest
          </span>
          <span className="text-lg font-bold text-sky-300 font-mono">
            ₹{totalInterest.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">over {duration} months</span>
        </div>

        {/* Total Repayment Card */}
        <div className="p-4 rounded-xl border border-surface-border bg-midnight-950 text-center flex flex-col justify-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Total Repayment
          </span>
          <span className="text-lg font-bold text-slate-200 font-mono">
            ₹{totalRepayment.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">Principal + Interest</span>
        </div>

      </div>

      {/* Recharts Visual Breakdown */}
      <div className="p-3.5 rounded-xl border border-surface-border bg-midnight-950/80 flex items-center justify-between gap-4">
        <div className="h-20 w-20 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={24}
                outerRadius={38}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 inline-block" />
              Principal ({( (amount / totalRepayment) * 100 ).toFixed(0)}%):
            </span>
            <span className="text-white font-semibold">₹{amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400 inline-block" />
              Interest ({( (totalInterest / totalRepayment) * 100 ).toFixed(0)}%):
            </span>
            <span className="text-cyan-300 font-semibold">₹{totalInterest.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Non-binding Estimate Disclaimer */}
      <div className="p-3 rounded-xl border border-surface-border bg-midnight-900/60 text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed">
        <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Important: </span>
          This is only an estimate. Final repayment terms, interest rates, and EMI may vary based on your profile verification, income assessment, and lender underwriting.
        </div>
      </div>

    </div>
  );
}
