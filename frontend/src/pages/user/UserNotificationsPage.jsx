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
          <div className="flex items-center gap-2 text-xs font-mono text-coffee-600 font-semibold">
            <span>BORROWER SERVICES</span>
            <span className="text-coffee-300">/</span>
            <span className="text-stone-500">NOTIFICATIONS & ALERTS</span>
          </div>
          <h1 className="text-2xl font-bold text-espresso tracking-tight mt-1">
            Notifications & Status Alerts
          </h1>
          <p className="text-xs text-stone-600">
            Real-time updates regarding your loan applications, underwriter action requests, and security milestones.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-coffee-200 bg-white text-xs font-mono text-coffee-800 hover:bg-coffee-50 transition-colors shadow-xs"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-coffee-100 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            activeFilter === 'ALL'
              ? 'bg-coffee-600 text-white font-semibold shadow-xs'
              : 'text-stone-600 hover:text-espresso'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            activeFilter === 'UNREAD'
              ? 'bg-coffee-600 text-white font-semibold shadow-xs'
              : 'text-stone-600 hover:text-espresso'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveFilter('ACTION')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            activeFilter === 'ACTION'
              ? 'bg-amber-600 text-white font-semibold shadow-xs'
              : 'text-stone-600 hover:text-espresso'
          }`}
        >
          Action Required ({notifications.filter(n => n.type === 'action').length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 font-mono text-xs">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-coffee-200 bg-white p-12 text-center text-stone-500 shadow-card">
            <Bell className="h-8 w-8 text-stone-400 mx-auto mb-2" />
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
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-card ${
                  n.unread
                    ? isAction
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-coffee-200 bg-coffee-50/30'
                    : 'border-coffee-100 bg-white text-stone-600'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      isAction
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : isVerif
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isSecurity
                        ? 'bg-coffee-50 text-coffee-700 border border-coffee-200'
                        : 'bg-stone-50 text-stone-600 border border-stone-200'
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
                        <h3 className={`font-sans font-bold text-sm ${n.unread ? 'text-espresso' : 'text-stone-700'}`}>
                          {n.title}
                        </h3>
                        {n.unread && (
                          <span className="h-2 w-2 rounded-full bg-coffee-600"></span>
                        )}
                      </div>

                      <p className="font-sans text-xs text-stone-600 leading-relaxed max-w-2xl">
                        {n.message}
                      </p>

                      <div className="pt-2 flex items-center gap-4 text-[10px] text-stone-500 font-mono">
                        <span>{n.timestamp}</span>
                        {n.actionUrl && (
                          <Link
                            to={n.actionUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="text-coffee-700 hover:text-coffee-900 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>{n.actionLabel}</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {n.unread && (
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-coffee-100 text-coffee-800 border border-coffee-200 shrink-0 font-semibold">
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
