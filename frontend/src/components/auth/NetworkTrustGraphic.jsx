import React from 'react';
import { FileCheck2, UserCheck, Share2, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function NetworkTrustGraphic({ className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Visual Network Canvas */}
      <div className="relative w-full max-w-[500px] aspect-[16/10] select-none">
        {/* Subtle Ambient Radial Glow behind the central trust core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-coffee-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* SVG Connection Graph with Animated Signal Particles */}
        <svg
          viewBox="0 0 500 300"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Concentric gradient rings */}
            <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6F4E37" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
            </radialGradient>

            {/* Line Gradients connecting to center */}
            <linearGradient id="lineGradTL" x1="90" y1="65" x2="250" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A88B77" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6F4E37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="lineGradTR" x1="410" y1="65" x2="250" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A88B77" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6F4E37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="lineGradBL" x1="90" y1="235" x2="250" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A88B77" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6F4E37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="lineGradBR" x1="410" y1="235" x2="250" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A88B77" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6F4E37" stopOpacity="0.9" />
            </linearGradient>

            {/* Particle Glow Filter */}
            <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Concentric Radar Rings */}
          <circle cx="250" cy="150" r="110" stroke="#E8DFD1" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="250" cy="150" r="60" stroke="#D4C3B3" strokeWidth="1" />
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
          <circle r="3.5" fill="#6F4E37" filter="url(#pulseGlow)">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 110 75 Q 180 100 225 138" keyTimes="0;1" keyPoints="0;1" />
          </circle>
          <circle r="2" fill="#FAF8F5">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 110 75 Q 180 100 225 138" keyTimes="0;1" keyPoints="0;1" />
          </circle>

          {/* Particle 2: KYC */}
          <circle r="3.5" fill="#8B5A2B" filter="url(#pulseGlow)">
            <animateMotion dur="3.4s" begin="0.7s" repeatCount="indefinite" path="M 390 75 Q 320 100 275 138" keyTimes="0;1" keyPoints="0;1" />
          </circle>
          <circle r="2" fill="#FAF8F5">
            <animateMotion dur="3.4s" begin="0.7s" repeatCount="indefinite" path="M 390 75 Q 320 100 275 138" keyTimes="0;1" keyPoints="0;1" />
          </circle>

          {/* Particle 3: Network */}
          <circle r="3.5" fill="#6F4E37" filter="url(#pulseGlow)">
            <animateMotion dur="3.1s" begin="1.4s" repeatCount="indefinite" path="M 110 225 Q 180 200 225 162" keyTimes="0;1" keyPoints="0;1" />
          </circle>
          <circle r="2" fill="#FAF8F5">
            <animateMotion dur="3.1s" begin="1.4s" repeatCount="indefinite" path="M 110 225 Q 180 200 225 162" keyTimes="0;1" keyPoints="0;1" />
          </circle>

          {/* Particle 4: Ledger */}
          <circle r="3.5" fill="#8B5A2B" filter="url(#pulseGlow)">
            <animateMotion dur="2.6s" begin="0.3s" repeatCount="indefinite" path="M 390 225 Q 320 200 275 162" keyTimes="0;1" keyPoints="0;1" />
          </circle>
          <circle r="2" fill="#FAF8F5">
            <animateMotion dur="2.6s" begin="0.3s" repeatCount="indefinite" path="M 390 225 Q 320 200 275 162" keyTimes="0;1" keyPoints="0;1" />
          </circle>
        </svg>

        {/* DOM Overlays for Crisp High-Res Text & Lucide Icons */}
        
        {/* Central Core: TRUST */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-coffee-300 bg-coffee-50 p-2.5 shadow-card transition-transform duration-300 hover:scale-105">
            {/* Outer subtle spinning ring */}
            <div className="absolute inset-[-4px] rounded-2xl border border-coffee-300 border-dashed animate-[spin_20s_linear_infinite]" />
            <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10 text-coffee-700" />
          </div>
          <div className="mt-2 text-center">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-coffee-900">
              TRUST
            </span>
            <span className="block text-[9px] font-mono text-stone-500 tracking-tight">
              ASSESSMENT
            </span>
          </div>
        </div>

        {/* Outer Node 1: DOCUMENT */}
        <div className="absolute left-[8%] top-[10%] flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-coffee-200 bg-white text-coffee-700 shadow-xs hover:border-coffee-400 transition-colors">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <span className="mt-1.5 font-mono text-[11px] font-semibold tracking-wide text-espresso">
            DOCUMENT
          </span>
          <span className="text-[9px] font-mono text-emerald-700 flex items-center gap-1 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Integrity
          </span>
        </div>

        {/* Outer Node 2: KYC */}
        <div className="absolute right-[8%] top-[10%] flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-coffee-200 bg-white text-coffee-700 shadow-xs hover:border-coffee-400 transition-colors">
            <UserCheck className="h-5 w-5" />
          </div>
          <span className="mt-1.5 font-mono text-[11px] font-semibold tracking-wide text-espresso">
            KYC SIGNALS
          </span>
          <span className="text-[9px] font-mono text-emerald-700 flex items-center gap-1 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Verified
          </span>
        </div>

        {/* Outer Node 3: FRAUD NETWORK */}
        <div className="absolute left-[8%] bottom-[8%] flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-coffee-200 bg-white text-coffee-700 shadow-xs hover:border-coffee-400 transition-colors">
            <Share2 className="h-5 w-5" />
          </div>
          <span className="mt-1.5 font-mono text-[11px] font-semibold tracking-wide text-espresso">
            NETWORK
          </span>
          <span className="text-[9px] font-mono text-stone-500">
            Link Analysis
          </span>
        </div>

        {/* Outer Node 4: EVIDENCE LEDGER */}
        <div className="absolute right-[8%] bottom-[8%] flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-coffee-200 bg-white text-coffee-700 shadow-xs hover:border-coffee-400 transition-colors">
            <Database className="h-5 w-5" />
          </div>
          <span className="mt-1.5 font-mono text-[11px] font-semibold tracking-wide text-espresso">
            LEDGER
          </span>
          <span className="text-[9px] font-mono text-stone-500">
            SHA-256 Chain
          </span>
        </div>

      </div>
    </div>
  );
}
