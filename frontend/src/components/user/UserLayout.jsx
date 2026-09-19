/**
 * TrustLedger UserLayout Component
 * Clean, trustworthy, mobile-first navigation for Indian borrower application.
 * Styled in White + Coffee Brown fintech design system.
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
    <div className="min-h-screen bg-surface-base text-coffee-950 flex flex-col justify-between selection:bg-coffee-600 selection:text-white">
      
      {/* Main Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-coffee-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo & Borrower Badge */}
            <div className="flex items-center gap-3">
              <Link to="/home" className="flex items-center gap-2">
                <TrustLedgerLogo size="default" />
              </Link>
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-coffee-50 border border-coffee-200 text-[11px] font-mono text-coffee-800 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-coffee-600" />
                <span>Borrower Portal</span>
              </div>
              {isDemo && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
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
                      `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-coffee-600 text-white shadow-sm'
                          : 'text-coffee-700 hover:text-coffee-950 hover:bg-coffee-50'
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
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-coffee-200 bg-coffee-50 text-xs shadow-sm">
                    {isVerified ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-800 font-bold">Verified</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        <span className="text-amber-800 font-bold">Setup Pending</span>
                      </>
                    )}
                    <span className="text-coffee-300">|</span>
                    <span className="text-coffee-950 font-semibold truncate max-w-[130px]">
                      {displayName}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-coffee-700 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all text-xs cursor-pointer shadow-sm"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 font-bold text-xs text-white uppercase tracking-wider shadow-sm transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl bg-white border border-coffee-200 text-xs font-semibold text-coffee-950 hover:bg-coffee-50 transition-colors shadow-sm"
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
                className="p-2 rounded-xl border border-coffee-200 text-coffee-700 hover:text-coffee-950 bg-coffee-50 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-coffee-200 bg-white px-4 pt-3 pb-4 space-y-2 animate-fadeIn shadow-lg">
            {/* User status banner */}
            <div className="p-3 rounded-xl border border-coffee-200 bg-coffee-50 mb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-coffee-950 block">{displayName}</span>
                <span className="text-[10px] text-coffee-600 block">{user?.email}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                {isVerified ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold flex items-center gap-1">
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
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-coffee-600 text-white shadow-sm'
                        : 'text-coffee-800 hover:bg-coffee-50'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            {/* Mobile Logout */}
            <div className="pt-2 border-t border-coffee-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-all cursor-pointer"
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
      <footer className="border-t border-coffee-200 bg-white py-5 px-6 text-center text-[11px] font-medium text-coffee-600 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-coffee-600" />
          <span>TrustLedger • Secure digital lending, verified from the start.</span>
        </div>
        <div>
          <span>One Person = One Verified User Account</span>
        </div>
      </footer>

    </div>
  );
}
