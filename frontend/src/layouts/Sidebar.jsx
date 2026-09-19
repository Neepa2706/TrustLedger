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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-coffee-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Header */}
        <div className="flex h-16 items-center px-6 border-b border-coffee-200">
          <NavLink to="/dashboard" onClick={onClose} className="focus:outline-none">
            <TrustLedgerLogo size="default" />
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-coffee-600 font-bold">
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
                  `group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-coffee-600 text-white shadow-sm'
                      : 'text-coffee-700 hover:bg-coffee-50 hover:text-coffee-950'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-white' : 'text-coffee-600 group-hover:text-coffee-900'}`} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        item.badge === 'Alert'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isActive
                            ? 'bg-coffee-700 text-white'
                            : 'bg-coffee-100 text-coffee-900 border border-coffee-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Security Shield Status Footer */}
        <div className="p-4 border-t border-coffee-200">
          <div className="rounded-2xl border border-coffee-200 bg-coffee-50/80 p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span className="text-xs font-bold text-coffee-950">Shield Active</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
            </div>
            <p className="mt-1 text-[11px] text-coffee-600 font-medium">
              Perimeter cryptographic guard monitoring digital loan originations.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
