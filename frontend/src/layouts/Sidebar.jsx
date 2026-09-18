import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Network,
  FileCheck,
  UserCheck,
  Database,
  Settings,
  ShieldCheck,
  ExternalLink,
  CheckCircle,
  BellRing
} from 'lucide-react';
import TrustLedgerLogo from '../components/branding/TrustLedgerLogo';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Applications', path: '/applications', icon: FileSpreadsheet, badge: '4 In Queue' },
  { name: 'Fraud Network', path: '/fraud-network', icon: Network, badge: 'Alert' },
  { name: 'Documents', path: '/documents', icon: FileCheck },
  { name: 'KYC Analysis', path: '/kyc-analysis', icon: UserCheck },
  { name: 'Evidence Ledger', path: '/evidence-ledger', icon: Database },
  { name: 'Approved Loans', path: '/approved-loans', icon: CheckCircle },
  { name: 'Alerts', path: '/alerts', icon: BellRing, badge: '8 Alert' },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-surface-border bg-midnight-950 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Header */}
        <div className="flex h-16 items-center px-6 border-b border-surface-border">
          <NavLink to="/dashboard" onClick={onClose} className="focus:outline-none">
            <TrustLedgerLogo size="default" />
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
            Intelligence Console
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                      : 'text-slate-400 hover:bg-surface-card hover:text-slate-100 hover:border hover:border-surface-border'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        item.badge === 'Alert'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-midnight-900 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyan-400"></span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Security Shield Status Footer */}
        <div className="p-4 border-t border-surface-border">
          <div className="rounded-xl border border-surface-border bg-midnight-900/90 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">Shield Active</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Perimeter cryptographic guard monitoring loan originations.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
