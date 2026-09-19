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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-coffee-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md shadow-sm">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-xl p-2 text-coffee-700 hover:bg-coffee-50 hover:text-coffee-950 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-coffee-600" />
          <input
            type="text"
            placeholder="Search applications, entity hashes, IDs, phone numbers..."
            className="w-full rounded-xl border border-coffee-200 bg-coffee-50/50 py-2 pl-10 pr-12 text-xs text-coffee-950 placeholder-coffee-400 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500 shadow-sm"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-coffee-500 border border-coffee-200 rounded px-1.5 py-0.5 bg-white">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: API Health Status, Notifications, Profile & Sign Out */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Demo Mode Badge */}
        {isDemo && (
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-mono text-amber-800 font-bold">
            <Sparkles className="h-3 w-3 text-amber-600" />
            DEMO SESSION
          </span>
        )}

        {/* Real-time Backend Health Pill */}
        <div className={`hidden md:flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono font-semibold ${
          isHealthy
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-amber-200 bg-amber-50 text-amber-800'
        }`}>
          {isHealthy ? (
            <Wifi className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-amber-600" />
          )}
          <span>API: {status.toUpperCase()}</span>
          {latencyMs && <span className="text-[10px] opacity-75">({latencyMs}ms)</span>}
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            className="relative rounded-xl border border-coffee-200 bg-white p-2 text-coffee-700 hover:text-coffee-950 hover:bg-coffee-50 transition-colors shadow-sm cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600"></span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 border-l border-coffee-200 pl-3 sm:pl-4">
          <div className="h-9 w-9 rounded-xl border border-coffee-300 bg-coffee-600 flex items-center justify-center text-white shadow-sm font-mono text-xs font-bold">
            {initials}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-coffee-950 leading-none">
              {displayName}
            </span>
            <span className="text-[10px] font-mono text-coffee-600 font-semibold mt-0.5">
              {displayRole}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 rounded-xl text-coffee-700 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all text-xs cursor-pointer"
            title="Sign out of investigator session"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
