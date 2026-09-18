import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = ''
}) {
  return (
    <div className={`rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-border">
          <div>
            {title && <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
}
