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
    <div className={`rounded-2xl border border-coffee-200 bg-white p-6 shadow-card transition-all ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-coffee-100">
          <div>
            {title && <h3 className="text-sm font-bold text-coffee-950 tracking-wide">{title}</h3>}
            {subtitle && <p className="text-xs text-coffee-600 mt-0.5">{subtitle}</p>}
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
