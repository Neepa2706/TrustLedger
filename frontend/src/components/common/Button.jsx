import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'ghost'
  size = 'md',        // 'sm', 'md', 'lg'
  icon: Icon,
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-base disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5'
  };

  const variantClasses = {
    primary: 'bg-coffee-600 hover:bg-coffee-700 text-white font-semibold shadow-sm hover:shadow active:bg-coffee-800 focus:ring-coffee-500',
    secondary: 'bg-white hover:bg-coffee-50 text-coffee-950 border border-coffee-200 hover:border-coffee-300 focus:ring-coffee-500 shadow-sm',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm focus:ring-rose-500',
    ghost: 'text-coffee-700 hover:text-coffee-950 hover:bg-coffee-100/60 focus:ring-coffee-500'
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
