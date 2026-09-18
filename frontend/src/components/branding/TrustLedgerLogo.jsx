import React from 'react';

export default function TrustLedgerLogo({ 
  size = 'default', // 'sm', 'default', 'lg'
  showTagline = false,
  className = '' 
}) {
  const iconSizes = {
    sm: 'w-6 h-6',
    default: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-base',
    default: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Visual Logo Mark: Shield + Cryptographic Ledger + Checkmark */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-md"></div>

        {/* Outer Shield Frame */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-[0_0_10px_rgba(0,240,255,0.35)]"
        >
          {/* Shield Base */}
          <path
            d="M18 3L5 8.5V17C5 25.5 10.5 32 18 34C25.5 32 31 25.5 31 17V8.5L18 3Z"
            fill="#0b1324"
            stroke="#1b2e50"
            strokeWidth="1.5"
          />
          {/* Inner Cyan Contour */}
          <path
            d="M18 5.5L7.5 10V17C7.5 24 12 29.5 18 31.2C24 29.5 28.5 24 28.5 17V10L18 5.5Z"
            stroke="#00f0ff"
            strokeWidth="1.25"
            strokeOpacity="0.8"
          />
          {/* Cryptographic Ledger Lines */}
          <line x1="12" y1="13" x2="24" y2="13" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
          <line x1="12" y1="17" x2="20" y2="17" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
          <line x1="12" y1="21" x2="17" y2="21" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
          
          {/* Shield Center Node / Checkmark of Proof */}
          <path
            d="M16 23L19 25.5L25 18"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-white ${textSizes[size]}`}>
            Trust<span className="text-cyan-400">Ledger</span>
          </span>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
            Shield
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-slate-400 font-medium">
            AI + Cybersecurity Fraud Shield for Digital Lending
          </span>
        )}
      </div>
    </div>
  );
}
