import React from 'react';

export default function RiskScoreRing({
  score = 0,
  size = 140,
  strokeWidth = 10,
  label = 'Risk Index',
  showDetails = true,
  className = ''
}) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorScheme = {
    ring: '#10b981',
    glow: 'rgba(16, 185, 129, 0.15)',
    text: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tier: 'LOW RISK'
  };

  if (normalizedScore > 65) {
    colorScheme = {
      ring: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.15)',
      text: 'text-red-700',
      badge: 'bg-red-50 text-red-700 border-red-200',
      tier: 'CRITICAL'
    };
  } else if (normalizedScore > 35) {
    colorScheme = {
      ring: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.15)',
      text: 'text-amber-700',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      tier: 'SUSPICIOUS'
    };
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Ambient Backlight */}
        <div 
          className="absolute inset-2 rounded-full blur-xl transition-all duration-700" 
          style={{ backgroundColor: colorScheme.glow }}
        />

        <svg width={size} height={size} className="rotate-[-90deg] relative z-10">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E8DFD1"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Value Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorScheme.ring}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
          <span className="font-mono text-3xl font-bold tracking-tight text-espresso">
            {normalizedScore}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">
            /100
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2.5 flex flex-col items-center text-center">
          <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full border ${colorScheme.badge}`}>
            {colorScheme.tier}
          </span>
          {label && (
            <span className="text-[11px] text-stone-500 mt-1 font-medium">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
