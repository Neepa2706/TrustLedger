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
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-950/40',
      status: 'Review'
    },
    {
      id: 'kyc',
      name: 'KYC',
      label: 'Face Quality',
      weight: '25%',
      icon: UserCheck,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-950/40',
      status: 'Verified'
    },
    {
      id: 'network',
      name: 'NETWORK',
      label: 'Entity Graph',
      weight: '25%',
      icon: Network,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-950/40',
      status: 'Signal Watch'
    },
    {
      id: 'integrity',
      name: 'INTEGRITY',
      label: 'SHA-256 Ledger',
      weight: '25%',
      icon: ShieldCheck,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-950/40',
      status: 'Verified'
    }
  ];

  return (
    <div className={`rounded-xl border border-surface-border bg-surface-card/90 p-5 backdrop-blur-sm relative overflow-hidden ${className}`}>
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">Multi-Pillar Trust Assessment</h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>
          <p className="text-xs text-slate-400">Synthesis of behavioral, cryptographic, and biometric signals</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
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
                className={`p-3 rounded-xl border ${p.borderColor} ${p.bgColor} backdrop-blur-sm transition-all hover:scale-[1.02] shadow-sm`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`h-4 w-4 ${p.color}`} />
                    <span className="text-xs font-bold font-mono tracking-wider text-white">{p.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{p.weight}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{p.label}</span>
                  <span className={`font-semibold ${p.color}`}>{p.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Convergence Arrow Animation */}
        <div className="hidden md:flex flex-col items-center justify-center text-cyan-400/60 shrink-0">
          <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-500/40 via-cyan-400 to-transparent relative animate-pulse">
            <div className="absolute -top-1 right-0 w-2 h-2 rotate-45 border-t-2 border-r-2 border-cyan-400"></div>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 mt-1 uppercase tracking-widest">FUSION</span>
        </div>

        {/* Right Side: Central Trust Hub */}
        <div className="w-full md:w-5/12 flex flex-col items-center justify-center p-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/60 via-midnight-950 to-blue-950/40 text-center relative shadow-lg shadow-cyan-950/30">
          
          <div className="relative mb-2">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-800/80"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="currentColor"
                strokeWidth="8"
                className="text-cyan-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - score / 100)}`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white font-mono tracking-tight">{score}%</span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-300 font-bold">TRUST</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Portfolio Trust</h4>
            <p className="text-[11px] text-slate-300">
              68% composite confidence score calibrated across live digital evidence.
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-surface-border/80 w-full flex items-center justify-around text-[10px] font-mono text-slate-400">
            <span>Risk: <strong className="text-amber-400">MEDIUM</strong></span>
            <span>•</span>
            <span>Verdict: <strong className="text-cyan-300">AI ADVISORY</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
}
