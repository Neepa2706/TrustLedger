import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Clock, FileX2 } from 'lucide-react';

const statusConfig = {
  SAFE: {
    label: 'VERIFIED SAFE',
    icon: ShieldCheck,
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600'
  },
  VERIFIED: {
    label: 'VERIFIED',
    icon: ShieldCheck,
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600'
  },
  WARNING: {
    label: 'SUSPICIOUS',
    icon: AlertTriangle,
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-600'
  },
  SUSPICIOUS: {
    label: 'SUSPICIOUS',
    icon: AlertTriangle,
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-600'
  },
  CRITICAL: {
    label: 'HIGH RISK',
    icon: ShieldAlert,
    classes: 'bg-rose-50 text-rose-800 border-rose-200',
    dot: 'bg-rose-600'
  },
  FLAGGED: {
    label: 'FLAGGED FRAUD',
    icon: ShieldAlert,
    classes: 'bg-rose-50 text-rose-800 border-rose-200',
    dot: 'bg-rose-600'
  },
  TAMPERED: {
    label: 'TAMPER DETECTED',
    icon: FileX2,
    classes: 'bg-rose-50 text-rose-800 border-rose-200',
    dot: 'bg-rose-600'
  },
  'UNDER REVIEW': {
    label: 'UNDER REVIEW',
    icon: Clock,
    classes: 'bg-coffee-50 text-coffee-800 border-coffee-200',
    dot: 'bg-coffee-600'
  },
  UNDER_REVIEW: {
    label: 'UNDER REVIEW',
    icon: Clock,
    classes: 'bg-coffee-50 text-coffee-800 border-coffee-200',
    dot: 'bg-coffee-600'
  },
  SUBMITTED: {
    label: 'SUBMITTED',
    icon: Clock,
    classes: 'bg-coffee-50 text-coffee-800 border-coffee-200',
    dot: 'bg-coffee-600'
  },
  APPROVED: {
    label: 'APPROVED',
    icon: ShieldCheck,
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600'
  },
  ACTION_REQUIRED: {
    label: 'ACTION REQUIRED',
    icon: AlertTriangle,
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-600'
  },
  REJECTED: {
    label: 'REJECTED',
    icon: ShieldAlert,
    classes: 'bg-rose-50 text-rose-800 border-rose-200',
    dot: 'bg-rose-600'
  },
  PENDING: {
    label: 'PENDING CHECK',
    icon: Clock,
    classes: 'bg-stone-50 text-stone-700 border-stone-200',
    dot: 'bg-stone-500'
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
  const normalizedKey = status.toUpperCase().replace(/\s+/g, '_');
  const config = statusConfig[normalizedKey] || statusConfig[status.toUpperCase()] || {
    label: status,
    icon: Clock,
    classes: 'bg-stone-50 text-stone-700 border-stone-200',
    dot: 'bg-stone-500'
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
