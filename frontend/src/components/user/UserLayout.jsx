/**
 * TrustLedger UserLayout Component
 * Clean, trustworthy, mobile-first navigation for Indian borrower application.
 */

import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import {
  Home,
  FileSpreadsheet,
  FileCheck2,
  CreditCard,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import TrustLedgerLogo from '../branding/TrustLedgerLogo';
import { useUserAuth } from '../../context/UserAuthContext';

export default function UserLayout() {
  const { user, profile, logout, isDemo } = useUserAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Loans', path: '/loans', icon: FileSpreadsheet },
    { name: 'My Applications', path: '/my-applications', icon: FileCheck2 },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const isVerified = profile?.verification_status === 'VERIFIED';
  const displayName = profile?.full_name || user?.fullName || 'Beneficiary';

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-midnight-950">
      
      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      {/* Main Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-surface-border/80 bg-midnight-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo & Borrower Badge */}
            <div className="flex items-center gap-3">
              <Link to="/home" className="flex items-center gap-2">
                <TrustLedgerLogo size="default" />
              </Link>
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
                <ShieldCheck className="h-3 w-3 text-cyan-400" />
                <span>Borrower Portal</span>
              </div>
              {isDemo && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/30 font-medium">
                  DEMO MODE
                </span>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                          : 'text-slate-400 hover:text-white hover:bg-midnight-900'
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Right: User Status & Sign Out */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  {/* Verification Status Pill */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-surface-border bg-midnight-900 text-[11px]">
                    {isVerified ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-semibold">Verified</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-amber-300 font-medium">Setup Pending</span>
                      </>
                    )}
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-200 font-medium truncate max-w-[120px]">
                      {displayName}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-500/30 transition-all text-xs"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs text-midnight-950 uppercase tracking-wider shadow"
                  >
                    Applicant Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-lg bg-midnight-900 border border-surface-border text-xs text-slate-300 hover:text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg border border-surface-border text-slate-300 hover:text-white bg-midnight-900"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-surface-border bg-midnight-950 px-4 pt-3 pb-4 space-y-2 animate-fadeIn">
            {/* User status banner */}
            <div className="p-3 rounded-lg border border-surface-border bg-midnight-900 mb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">{displayName}</span>
                <span className="text-[10px] text-slate-400 block">{user?.email}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                {isVerified ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Pending Setup
                  </span>
                )}
              </div>
            </div>

            {/* Nav items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:bg-midnight-900'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 text-cyan-400" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            {/* Mobile Logout */}
            <div className="pt-2 border-t border-surface-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/30 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Trust Ledger Customer Footer */}
      <footer className="border-t border-surface-border/60 bg-midnight-950 py-4 px-6 text-center text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
          <span>TrustLedger • Secure digital lending, verified from the start.</span>
        </div>
        <div>
          <span>One Person = One Verified User Account</span>
        </div>
      </footer>

    </div>
  );
}
