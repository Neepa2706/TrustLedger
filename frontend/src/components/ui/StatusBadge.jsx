import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Clock, FileX2 } from 'lucide-react';

const statusConfig = {
  SAFE: {
    label: 'VERIFIED SAFE',
    icon: ShieldCheck,
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400'
  },
  VERIFIED: {
    label: 'VERIFIED',
    icon: ShieldCheck,
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400'
  },
  WARNING: {
    label: 'SUSPICIOUS',
    icon: AlertTriangle,
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400'
  },
  SUSPICIOUS: {
    label: 'SUSPICIOUS',
    icon: AlertTriangle,
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400'
  },
  CRITICAL: {
    label: 'HIGH RISK',
    icon: ShieldAlert,
    classes: 'bg-red-500/10 text-red-400 border-red-500/30',
    dot: 'bg-red-400'
  },
  FLAGGED: {
    label: 'FLAGGED FRAUD',
    icon: ShieldAlert,
    classes: 'bg-red-500/10 text-red-400 border-red-500/30',
    dot: 'bg-red-400'
  },
  TAMPERED: {
    label: 'TAMPER DETECTED',
    icon: FileX2,
    classes: 'bg-red-500/10 text-red-400 border-red-500/30',
    dot: 'bg-red-400'
  },
  'UNDER REVIEW': {
    label: 'UNDER REVIEW',
    icon: Clock,
    classes: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    dot: 'bg-cyan-400'
  },
  SUBMITTED: {
    label: 'SUBMITTED',
    icon: Clock,
    classes: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    dot: 'bg-cyan-400'
  },
  APPROVED: {
    label: 'APPROVED',
    icon: ShieldCheck,
    classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
    dot: 'bg-emerald-400'
  },
  ACTION_REQUIRED: {
    label: 'ACTION REQUIRED',
    icon: AlertTriangle,
    classes: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    dot: 'bg-amber-400'
  },
  REJECTED: {
    label: 'REJECTED',
    icon: ShieldAlert,
    classes: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
    dot: 'bg-rose-400'
  },
  PENDING: {
    label: 'PENDING CHECK',
    icon: Clock,
    classes: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    dot: 'bg-slate-400'
  }
};

export default function StatusBadge({
  status = 'PENDING',
  customLabel,
  pulse = false,
  showIcon = true,
  size = 'md',
  className = ''
}) {
  const normalizedKey = status.toUpperCase();
  const config = statusConfig[normalizedKey] || {
    label: status,
    icon: Clock,
    classes: 'bg-slate-500/10 text-slate-300 border-slate-700/50',
    dot: 'bg-slate-400'
  };

  const IconComponent = config.icon;
  const labelText = customLabel || config.label;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-mono font-semibold border tracking-wider uppercase transition-colors ${sizeClasses[size]} ${config.classes} ${className}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}></span>
        </span>
      )}
      {showIcon && !pulse && (
        <IconComponent className="h-3 w-3 shrink-0" />
      )}
      <span>{labelText}</span>
    </span>
  );
}
