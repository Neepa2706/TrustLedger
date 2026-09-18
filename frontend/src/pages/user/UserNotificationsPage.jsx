/**
 * TrustLedger User Notifications Page (/notifications)
 * Section 14: Displays chronological loan status alerts, underwriter action requests,
 * identity verification milestones, and security access logs.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Filter,
  Check,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';

export default function UserNotificationsPage() {
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Action Required: Bank Statement Clarification',
      message: 'Underwriting team requires a clearer PDF export of your last month salary deposit before disbursement.',
      timestamp: '2 hours ago',
      type: 'action',
      unread: true,
      actionUrl: '/my-applications/TL-APP-10001',
      actionLabel: 'Resolve Action Request'
    },
    {
      id: 'notif-2',
      title: 'Application TL-APP-10001 Under Review',
      message: 'Your Personal Loan application for ₹2,00,000 has passed initial automated quality checks and is in underwriter triage.',
      timestamp: '5 hours ago',
      type: 'status',
      unread: true,
      actionUrl: '/my-applications/TL-APP-10001',
      actionLabel: 'View Application Status'
    },
    {
      id: 'notif-3',
      title: 'Profile Identity Successfully Verified',
      message: 'Your Aadhaar and PAN documents have passed document-based identity checks.',
      timestamp: 'Yesterday at 14:22',
      type: 'verification',
      unread: false,
      actionUrl: '/profile',
      actionLabel: 'View Verified Credentials'
    },
    {
      id: 'notif-4',
      title: 'Security Notice: New Session Initiated',
      message: 'Successful authentication verified from your authorized IP address.',
      timestamp: 'Yesterday at 10:15',
      type: 'security',
      unread: false,
      actionUrl: '/profile',
      actionLabel: 'Security Settings'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('ALL');

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'UNREAD') return n.unread;
    if (activeFilter === 'ACTION') return n.type === 'action';
    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>BORROWER SERVICES</span>
            <span>/</span>
            <span className="text-slate-400">NOTIFICATIONS & ALERTS</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Notifications & Status Alerts
          </h1>
          <p className="text-xs text-slate-400">
            Real-time updates regarding your loan applications, underwriter action requests, and security milestones.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-border bg-midnight-950 text-xs font-mono text-cyan-300 hover:text-white transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'ALL'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'UNREAD'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveFilter('ACTION')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'ACTION'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Action Required ({notifications.filter(n => n.type === 'action').length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 font-mono text-xs">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-12 text-center text-slate-400">
            <Bell className="h-8 w-8 text-slate-500 mx-auto mb-2" />
            <p>No notifications matching this filter.</p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const isAction = n.type === 'action';
            const isSecurity = n.type === 'security';
            const isVerif = n.type === 'verification';

            return (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  n.unread
                    ? isAction
                      ? 'border-amber-500/50 bg-amber-950/20 shadow-md'
                      : 'border-cyan-500/40 bg-surface-card/90 shadow-md'
                    : 'border-surface-border bg-surface-card/50 text-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      isAction
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        : isVerif
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : isSecurity
                        ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                    }`}>
                      {isAction ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : isVerif ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isSecurity ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-sans font-bold text-sm ${n.unread ? 'text-white' : 'text-slate-300'}`}>
                          {n.title}
                        </h3>
                        {n.unread && (
                          <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                        )}
                      </div>

                      <p className="font-sans text-xs text-slate-300 leading-relaxed max-w-2xl">
                        {n.message}
                      </p>

                      <div className="pt-2 flex items-center gap-4 text-[10px] text-slate-400 font-mono">
                        <span>{n.timestamp}</span>
                        {n.actionUrl && (
                          <Link
                            to={n.actionUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>{n.actionLabel}</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {n.unread && (
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 shrink-0">
                      NEW
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
