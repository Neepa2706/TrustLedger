import React from 'react';
import { FileCheck2, UserCheck, Share2, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function NetworkTrustGraphic({ className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Visual Network Canvas */}
      <div className="relative w-full max-w-[500px] aspect-[16/10] select-none">
        {/* Subtle Ambient Radial Glow behind the central trust core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* SVG Connection Graph with Animated Signal Particles */}
        <svg
          viewBox="0 0 500 300"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(0,0,0,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Concentric gradient rings */}
            <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </radialGradient>

            {/* Line Gradients connecting to center */}
            <linearGradient id="lineGradTL" x1="90" y1="65" x2="250" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="lineGradTR" x1="410" y1="65" x2="250" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="lineGradBL" x1="90" y1="235" x2="250" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="lineGradBR" x1="410" y1="235" x2="250" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.8" />
            </linearGradient>

            {/* Particle Glow Filter */}
            <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Concentric Radar Rings */}
          <circle cx="250" cy="150" r="110" stroke="#162238" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="250" cy="150" r="60" stroke="#1e2e4a" strokeWidth="1" />
          <circle cx="250" cy="150" r="140" fill="url(#centralGlow)" />

          {/* Connection Vector Lines */}
          {/* Top-Left: Document -> Trust */}
          <path id="path-doc" d="M 110 75 Q 180 100 225 138" stroke="url(#lineGradTL)" strokeWidth="1.75" />
          {/* Top-Right: KYC -> Trust */}
          <path id="path-kyc" d="M 390 75 Q 320 100 275 138" stroke="url(#lineGradTR)" strokeWidth="1.75" />
          {/* Bottom-Left: Network -> Trust */}
          <path id="path-net" d="M 110 225 Q 180 200 225 162" stroke="url(#lineGradBL)" strokeWidth="1.75" />
          {/* Bottom-Right: Ledger -> Trust */}
          <path id="path-led" d="M 390 225 Q 320 200 275 162" stroke="url(#lineGradBR)" strokeWidth="1.75" />

          {/* Animated Particles flowing along paths toward Central Trust Shield */}
          {/* Particle 1: Document */}
          <circle r="3.5" fill="#00f0ff" filter="url(#pulseGlow)">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 110 75 Q 180 100 225 138" keyTimes="0;1" keyPoints="0;1" />
          </circle>
          <circle r="2" fill="#ffffff">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 110 75 Q 180 100 225 138" keyTimes="0;1" keyPoints="0;1" />
          </circle>

          {/* Particle 2: KYC */}
          <circle r="3.5" fill="#38bdf8" filter="url(#pulseGlow)">
            <animateMotion dur="3.4s" begin="0.7s" repeatCount="indefinite" path="M 390 75 Q 320 100 275 138" keyTimes="0;1" keyPoints="0;1" />
          </circle>
          <circle r="2" fill="#ffffff">
            <animateMotion dur="3.4s" begin="0.7s" repeatCount="indefinite" path="M 390 75 Q 320 100 275 138" keyTimes="0;1" keyPoints="0;1" />
          </circle>

          {/* Particle 3: Network */}
          <circle r="3.5" fill="#00f0ff" filter="url(#pulseGlow)">
            <animateMotion dur="3.1s" begin="1.4s" repeatCount="indefinite" path="M 110 225 Q 180 200 225 162" keyTimes="0;1" keyPoints="0;1" />
          </circle>
          <circle r="2" fill="#ffffff">
            <animateMotion dur="3.1s" begin="1.4s" repeatCount="indefinite" path="M 110 225 Q 180 200 225 162" keyTimes="0;1" keyPoints="0;1" />
          </circle>

          {/* Particle 4: Ledger */}
          <circle r="3.5" fill="#38bdf8" filter="url(#pulseGlow)">
            <animateMotion dur="2.6s" begin="0.3s" repeatCount="indefinite" path="M 390 225 Q 320 200 275 162" keyTimes="0;1" keyPoints="0;1" />
          </circle>
          <circle r="2" fill="#ffffff">
            <animateMotion dur="2.6s" begin="0.3s" repeatCount="indefinite" path="M 390 225 Q 320 200 275 162" keyTimes="0;1" keyPoints="0;1" />
          </circle>
        </svg>

        {/* DOM Overlays for Crisp High-Res Text & Lucide Icons */}
        
        {/* Central Core: TRUST */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-cyan-400/50 bg-gradient-to-b from-cyan-950/90 to-midnight-950 p-2.5 shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-transform duration-300 hover:scale-105">
            {/* Outer subtle spinning ring */}
            <div className="absolute inset-[-4px] rounded-2xl border border-cyan-500/20 border-dashed animate-[spin_20s_linear_infinite]" />
            <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
          </div>
          <div className="mt-2 text-center">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-cyan-300 drop-shadow">
              TRUST
            </span>
            <span className="block text-[9px] font-mono text-slate-400 tracking-tight">
              ASSESSMENT
            </span>
          </div>
        </div>

        {/* Outer Node 1: DOCUMENT */}
        <div className="absolute left-[8%] top-[10%] flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-surface-border bg-midnight-900/95 text-cyan-400 shadow-md backdrop-blur hover:border-cyan-400/60 transition-colors">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <span className="mt-1.5 font-mono text-[11px] font-semibold tracking-wide text-slate-200">
            DOCUMENT
          </span>
          <span className="text-[9px] font-mono text-emerald-400/90 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Integrity
          </span>
        </div>

        {/* Outer Node 2: KYC */}
        <div className="absolute right-[8%] top-[10%] flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-surface-border bg-midnight-900/95 text-cyan-400 shadow-md backdrop-blur hover:border-cyan-400/60 transition-colors">
            <UserCheck className="h-5 w-5" />
          </div>
          <span className="mt-1.5 font-mono text-[11px] font-semibold tracking-wide text-slate-200">
            KYC
          </span>
          <span className="text-[9px] font-mono text-emerald-400/90 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Liveness
          </span>
        </div>

        {/* Outer Node 3: NETWORK */}
        <div className="absolute left-[8%] bottom-[8%] flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-surface-border bg-midnight-900/95 text-cyan-400 shadow-md backdrop-blur hover:border-cyan-400/60 transition-colors">
            <Share2 className="h-5 w-5" />
          </div>
          <span className="mt-1.5 font-mono text-[11px] font-semibold tracking-wide text-slate-200">
            NETWORK
          </span>
          <span className="text-[9px] font-mono text-cyan-400/90 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Clustered
          </span>
        </div>

        {/* Outer Node 4: LEDGER */}
        <div className="absolute right-[8%] bottom-[8%] flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-surface-border bg-midnight-900/95 text-cyan-400 shadow-md backdrop-blur hover:border-cyan-400/60 transition-colors">
            <Database className="h-5 w-5" />
          </div>
          <span className="mt-1.5 font-mono text-[11px] font-semibold tracking-wide text-slate-200">
            LEDGER
          </span>
          <span className="text-[9px] font-mono text-emerald-400/90 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Anchored
          </span>
        </div>
      </div>

      {/* Trust Indicators Required by Prompt (Section 6) */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md pt-3 border-t border-surface-border/70">
        <div className="flex flex-col items-center text-center p-2 rounded-lg border border-surface-border/60 bg-midnight-900/40">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">
            DOCUMENT INTEGRITY
          </span>
          <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Verified
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-2 rounded-lg border border-surface-border/60 bg-midnight-900/40">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">
            IDENTITY SIGNALS
          </span>
          <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Monitored
          </span>
        </div>

        <div className="flex flex-col items-center text-center p-2 rounded-lg border border-surface-border/60 bg-midnight-900/40">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">
            FRAUD NETWORK
          </span>
          <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Analyzed
          </span>
        </div>
      </div>
    </div>
  );
}
