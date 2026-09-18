import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'ghost'
  size = 'md',        // 'sm', 'md', 'lg'
  icon: Icon,
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-midnight-950 disabled:opacity-50 disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-midnight-950 font-semibold shadow-[0_0_15px_rgba(0,240,255,0.25)] focus:ring-cyan-400',
    secondary: 'bg-surface-card hover:bg-surface-hover text-slate-200 border border-surface-border hover:border-slate-600 focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white font-semibold shadow-[0_0_15px_rgba(239,68,68,0.25)] focus:ring-red-500',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5 focus:ring-slate-500'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </button>
  );
}
