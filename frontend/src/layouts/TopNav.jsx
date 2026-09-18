import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Shield, User, Terminal, Wifi, WifiOff, LogOut, Sparkles } from 'lucide-react';
import { useHealthCheck } from '../hooks/useHealthCheck';
import { useAuth } from '../hooks/useAuth';

export default function TopNav({ onOpenMobileSidebar }) {
  const navigate = useNavigate();
  const { status, latencyMs } = useHealthCheck(10000);
  const { user, isDemo, logout } = useAuth();
  const isHealthy = status === 'healthy';

  const handleSignOut = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.name || 'Lead Analyst';
  const displayRole = user?.role || 'Fraud SecOps';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'TL';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-surface-border bg-midnight-950/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-400 hover:bg-surface-card hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search applications, entity hashes, SSNs, phone numbers..."
            className="w-full rounded-lg border border-surface-border bg-midnight-900 py-1.5 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 border border-slate-700/60 rounded px-1.5 py-0.5">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: API Health Status, Notifications, Profile & Sign Out */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Demo Mode Badge */}
        {isDemo && (
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/50 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300">
            <Sparkles className="h-3 w-3 text-cyan-400" />
            DEMO SESSION
          </span>
        )}

        {/* Real-time Backend Health Pill */}
        <div className={`hidden md:flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-mono ${
          isHealthy
            ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
            : 'border-amber-500/30 bg-amber-950/40 text-amber-300'
        }`}>
          {isHealthy ? (
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-amber-400" />
          )}
          <span>API: {status.toUpperCase()}</span>
          {latencyMs && <span className="text-[10px] opacity-75">({latencyMs}ms)</span>}
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            className="relative rounded-lg border border-surface-border bg-surface-card p-2 text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 border-l border-surface-border pl-3 sm:pl-4">
          <div className="h-8 w-8 rounded-full border border-cyan-500/40 bg-gradient-to-tr from-cyan-900 to-slate-800 flex items-center justify-center text-cyan-300 shadow-sm font-mono text-xs font-bold">
            {initials}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-white leading-none">
              {displayName}
            </span>
            <span className="text-[10px] font-mono text-cyan-400/90 mt-0.5">
              {displayRole}
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            title="Sign out of TrustLedger"
            aria-label="Sign out"
            className="ml-1 p-1.5 rounded-lg border border-surface-border text-slate-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-950/20 transition-all"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
