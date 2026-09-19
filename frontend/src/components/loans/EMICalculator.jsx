/**
 * TrustLedger EMICalculator Component
 * Interactive Indian EMI calculator with amount and duration sliders,
 * standard mathematical calculation, visual breakdown, and explicit disclaimer.
 * Styled in White & Coffee Brown fintech design system.
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

  // Chart data for visual breakdown: rich coffee brown and warm beige
  const chartData = [
    { name: 'Principal Amount', value: amount, color: '#6F4E37' },
    { name: 'Total Interest', value: totalInterest, color: '#D3C3AD' }
  ];

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-card space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-coffee-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-coffee-50 border border-coffee-200 text-coffee-700">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-coffee-950">Estimated EMI Calculator</h3>
            <span className="text-[11px] font-mono text-coffee-600 font-medium">
              Indicative Rate: {interestRate}% p.a.
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-coffee-100 text-coffee-800 border border-coffee-200 font-bold">
          Interactive Estimate
        </span>
      </div>

      {/* Sliders & Inputs */}
      <div className="space-y-5">
        
        {/* Loan Amount */}
        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="text-coffee-700 font-medium">
              Loan Amount
            </span>
            <span className="text-base font-bold text-coffee-950 font-mono">
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
            className="w-full h-2 bg-coffee-100 rounded-lg appearance-none cursor-pointer accent-coffee-600"
          />
          <div className="flex justify-between text-[10px] font-mono text-coffee-500 mt-1">
            <span>Min: ₹{minAmount.toLocaleString('en-IN')}</span>
            <span>Max: ₹{maxAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Duration Tenure */}
        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="text-coffee-700 font-medium">
              Repayment Duration
            </span>
            <span className="text-base font-bold text-coffee-950 font-mono">
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
            className="w-full h-2 bg-coffee-100 rounded-lg appearance-none cursor-pointer accent-coffee-600"
          />
          <div className="flex justify-between text-[10px] font-mono text-coffee-500 mt-1">
            <span>{minDuration} Months</span>
            <span>{maxDuration} Months</span>
          </div>
        </div>

      </div>

      {/* Results Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        
        {/* Estimated Monthly EMI Card */}
        <div className="p-4 rounded-xl border border-coffee-300 bg-coffee-50 text-center flex flex-col justify-center shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-wider text-coffee-700 font-bold mb-1">
            Estimated Monthly EMI
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-coffee-950 font-mono">
            ₹{emi.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-coffee-600 mt-1 font-medium">per month</span>
        </div>

        {/* Total Interest Card */}
        <div className="p-4 rounded-xl border border-coffee-200 bg-white text-center flex flex-col justify-center shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-wider text-coffee-600 font-medium mb-1">
            Total Interest
          </span>
          <span className="text-lg font-bold text-coffee-900 font-mono">
            ₹{totalInterest.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-coffee-500 mt-1">over {duration} months</span>
        </div>

        {/* Total Repayment Card */}
        <div className="p-4 rounded-xl border border-coffee-200 bg-white text-center flex flex-col justify-center shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-wider text-coffee-600 font-medium mb-1">
            Total Repayment
          </span>
          <span className="text-lg font-bold text-coffee-950 font-mono">
            ₹{totalRepayment.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-coffee-500 mt-1">Principal + Interest</span>
        </div>

      </div>

      {/* Visual Chart Breakdown */}
      <div className="p-4 rounded-xl border border-coffee-100 bg-coffee-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={52}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E8DFD1',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: '#1F1610',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-coffee-600 shrink-0" />
              <span className="text-coffee-700">Principal Amount:</span>
            </div>
            <span className="font-bold text-coffee-950 font-mono">
              ₹{amount.toLocaleString('en-IN')} ({((amount / totalRepayment) * 100).toFixed(0)}%)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-coffee-300 shrink-0" />
              <span className="text-coffee-700">Interest Payable:</span>
            </div>
            <span className="font-bold text-coffee-950 font-mono">
              ₹{totalInterest.toLocaleString('en-IN')} ({((totalInterest / totalRepayment) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Regulatory Disclaimer */}
      <div className="p-3 rounded-xl border border-coffee-200 bg-coffee-50/70 text-[11px] text-coffee-600 flex items-start gap-2">
        <Info className="h-4 w-4 text-coffee-600 shrink-0 mt-0.5" />
        <span>
          <strong>Indicative calculation:</strong> Values displayed are mathematical estimates for planning purposes.
          Actual monthly instalments and sanctioned interest rates will be finalized by the underwriting team upon document verification.
        </span>
      </div>

    </div>
  );
}
