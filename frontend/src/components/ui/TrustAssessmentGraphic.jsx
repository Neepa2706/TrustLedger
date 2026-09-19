/**
 * TrustLedger Trust Assessment Graphic Component (Section 25)
 * Visual representation of the 4 key verification pillars converging into
 * the central Portfolio Trust Assessment:
 * DOCUMENT \
 *           \
 * KYC ----> TRUST ASSESSMENT (68% Portfolio Trust)
 *           /
 * NETWORK  /
 * INTEGRITY
 */

import React from 'react';
import { FileText, UserCheck, Network, ShieldCheck, Sparkles, Activity } from 'lucide-react';

export default function TrustAssessmentGraphic({ score = 68, className = '' }) {
  const pillars = [
    {
      id: 'doc',
      name: 'DOCUMENT',
      label: 'Forensic Pass',
      weight: '25%',
      icon: FileText,
      color: 'text-coffee-700',
      borderColor: 'border-coffee-200',
      bgColor: 'bg-stone-50/80',
      status: 'Review'
    },
    {
      id: 'kyc',
      name: 'KYC',
      label: 'Face Quality',
      weight: '25%',
      icon: UserCheck,
      color: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50/30',
      status: 'Verified'
    },
    {
      id: 'network',
      name: 'NETWORK',
      label: 'Entity Graph',
      weight: '25%',
      icon: Network,
      color: 'text-amber-800',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50/30',
      status: 'Signal Watch'
    },
    {
      id: 'integrity',
      name: 'INTEGRITY',
      label: 'SHA-256 Ledger',
      weight: '25%',
      icon: ShieldCheck,
      color: 'text-coffee-800',
      borderColor: 'border-coffee-200',
      bgColor: 'bg-coffee-50/40',
      status: 'Verified'
    }
  ];

  return (
    <div className={`rounded-2xl border border-coffee-200 bg-white p-5 shadow-card relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-coffee-100 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-espresso tracking-wide">Multi-Pillar Trust Assessment</h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coffee-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-coffee-600"></span>
            </span>
          </div>
          <p className="text-xs text-stone-600">Synthesis of behavioral, cryptographic, and biometric signals</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coffee-50 text-coffee-800 border border-coffee-200 font-semibold">
          REAL-TIME FUSION
        </span>
      </div>

      {/* Architecture Graphic */}
      <div className="relative py-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: 4 Pillars */}
        <div className="w-full md:w-1/2 grid grid-cols-2 gap-3 relative z-10">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`p-3 rounded-xl border ${p.borderColor} ${p.bgColor} transition-all hover:scale-[1.02] shadow-xs`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`h-4 w-4 ${p.color}`} />
                    <span className="text-xs font-bold font-mono tracking-wider text-espresso">{p.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">{p.weight}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-600">{p.label}</span>
                  <span className={`font-semibold ${p.color}`}>{p.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Convergence Arrow Animation */}
        <div className="hidden md:flex flex-col items-center justify-center text-coffee-500 shrink-0">
          <div className="w-16 h-0.5 bg-gradient-to-r from-coffee-300 via-coffee-500 to-transparent relative animate-pulse">
            <div className="absolute -top-1 right-0 w-2 h-2 rotate-45 border-t-2 border-r-2 border-coffee-600"></div>
          </div>
          <span className="text-[10px] font-mono text-coffee-700 mt-1 uppercase tracking-widest font-semibold">FUSION</span>
        </div>

        {/* Right Side: Central Trust Hub */}
        <div className="w-full md:w-5/12 flex flex-col items-center justify-center p-5 rounded-2xl border border-coffee-200 bg-coffee-50/40 text-center relative shadow-xs">
          
          <div className="relative mb-2">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="currentColor"
                strokeWidth="8"
                className="text-stone-200"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="currentColor"
                strokeWidth="8"
                className="text-coffee-600 transition-all duration-1000 ease-out"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - score / 100)}`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-espresso font-mono tracking-tight">{score}%</span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-coffee-800 font-bold">TRUST</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-espresso uppercase tracking-wider font-mono">Portfolio Trust</h4>
            <p className="text-[11px] text-stone-600">
              68% composite confidence score calibrated across live digital evidence.
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-coffee-200 w-full flex items-center justify-around text-[10px] font-mono text-stone-600">
            <span>Risk: <strong className="text-amber-800">MEDIUM</strong></span>
            <span>•</span>
            <span>Verdict: <strong className="text-coffee-800">AI ADVISORY</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
}
