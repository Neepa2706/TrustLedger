/**
 * TrustLedger User Payments Page (/payments)
 * Section 22 & 52: Displays approved loan terms, payment progress, upcoming EMI schedule,
 * simulated UPI/Net Banking repayment gateway, and payment alerts.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Download,
  Calendar,
  Zap,
  TrendingUp,
  Landmark,
  QrCode,
  X
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';

export default function UserPaymentsPage() {
  const { user, profile } = useUserAuth();

  // Active Approved Loan State (Demo personal loan approved scenario)
  const [loanDetails, setLoanDetails] = useState({
    id: 'TL-APP-10001',
    productName: 'Personal Loan',
    sanctionedAmount: 200000,
    tenureMonths: 24,
    interestRate: 13.5,
    monthlyEmi: 9650,
    payoutBank: 'HDFC Bank (•••• 4821)',
    paidInstallments: 2,
    totalInstallments: 24,
    nextDueDate: '05 Oct 2026',
    status: 'ACTIVE'
  });

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const progressPercent = Math.round(
    (loanDetails.paidInstallments / loanDetails.totalInstallments) * 100
  );

  const handlePayEmi = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setLoanDetails((prev) => ({
        ...prev,
        paidInstallments: prev.paidInstallments + 1,
        nextDueDate: '05 Nov 2026'
      }));
    }, 1200);
  };

  const handleDownloadReceipt = () => {
    setToastMessage('Payment receipt TL-RCP-482109 downloaded successfully.');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-cyan-500/40 bg-midnight-950/95 text-xs text-cyan-300 shadow-2xl flex items-center gap-2 font-mono backdrop-blur-xl">
          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>BORROWER SERVICES</span>
            <span>/</span>
            <span className="text-slate-400">LOAN REPAYMENTS</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Loan Payments & EMI Progress
          </h1>
          <p className="text-xs text-slate-400">
            Track your sanctioned digital loan, repayment milestones, and automated payment alerts.
          </p>
        </div>

        <button
          onClick={() => setPaymentModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-midnight-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all"
        >
          <CreditCard className="h-4 w-4" />
          <span>Pay Next EMI (₹{loanDetails.monthlyEmi.toLocaleString('en-IN')})</span>
        </button>
      </div>

      {/* Payment Alert Notice (Section 52) */}
      <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 flex items-start gap-3 text-amber-200">
        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-amber-300 block">Upcoming Payment Notice</span>
          <p className="text-slate-300 leading-relaxed">
            Your next monthly EMI of <strong className="text-white">₹{loanDetails.monthlyEmi.toLocaleString('en-IN')}</strong> is scheduled for <strong className="text-white">{loanDetails.nextDueDate}</strong>. Auto-debit will be initiated from your registered bank account ({loanDetails.payoutBank}).
          </p>
        </div>
      </div>

      {/* Sanctioned Loan Terms Card (Section 22) */}
      <div className="rounded-2xl border border-surface-border bg-gradient-to-r from-surface-card via-surface-card to-cyan-950/30 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{loanDetails.productName}</h2>
              <span className="px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950 text-emerald-300 text-xs font-semibold">
                ACTIVE & SANCTIONED
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400 mt-1 block">
              Application ID: {loanDetails.id}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Sanctioned Capital</span>
            <span className="text-2xl font-black text-cyan-300 font-mono">
              ₹{loanDetails.sanctionedAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* 4 Term Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-slate-400 text-[10px] block uppercase">Monthly EMI</span>
            <span className="text-white font-bold text-sm">₹{loanDetails.monthlyEmi.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-slate-400 text-[10px] block uppercase">Tenure</span>
            <span className="text-white font-bold text-sm">{loanDetails.tenureMonths} Months</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-slate-400 text-[10px] block uppercase">Interest Rate</span>
            <span className="text-emerald-400 font-bold text-sm">{loanDetails.interestRate}% p.a.</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-slate-400 text-[10px] block uppercase">Linked Bank</span>
            <span className="text-white font-medium text-xs truncate block">{loanDetails.payoutBank}</span>
          </div>
        </div>

        {/* Repayment Progress Bar (Section 22 & 52) */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">
              Repayment Progress: <strong className="text-white">{loanDetails.paidInstallments} of {loanDetails.totalInstallments} EMIs Cleared</strong>
            </span>
            <span className="text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-midnight-950 border border-surface-border overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-700 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>Cleared: ₹{(loanDetails.paidInstallments * loanDetails.monthlyEmi).toLocaleString('en-IN')}</span>
            <span>Outstanding: ₹{((loanDetails.totalInstallments - loanDetails.paidInstallments) * loanDetails.monthlyEmi).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* EMI Schedule Table */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Recent & Upcoming EMI Installments</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Showing 4 Months</span>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {/* Installment 1 - Paid */}
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <div>
                <span className="text-white font-semibold block">EMI #1 — August 2026</span>
                <span className="text-[10px] text-slate-400">Paid via HDFC Autopay on 05 Aug 2026</span>
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <span className="text-white font-bold">₹{loanDetails.monthlyEmi.toLocaleString('en-IN')}</span>
              <button
                onClick={handleDownloadReceipt}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Download Receipt"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Installment 2 - Paid */}
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <div>
                <span className="text-white font-semibold block">EMI #2 — September 2026</span>
                <span className="text-[10px] text-slate-400">Paid via UPI on 05 Sep 2026</span>
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <span className="text-white font-bold">₹{loanDetails.monthlyEmi.toLocaleString('en-IN')}</span>
              <button
                onClick={handleDownloadReceipt}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Download Receipt"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Installment 3 - Next Due */}
          <div className="p-3.5 rounded-xl border border-cyan-500/50 bg-cyan-950/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-cyan-400 animate-pulse" />
              <div>
                <span className="text-cyan-300 font-bold block">EMI #{loanDetails.paidInstallments + 1} — Upcoming Due</span>
                <span className="text-[10px] text-slate-300">Due Date: {loanDetails.nextDueDate}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-cyan-300 font-bold">₹{loanDetails.monthlyEmi.toLocaleString('en-IN')}</span>
              <span className="block text-[10px] text-amber-300 font-bold">DUE SOON</span>
            </div>
          </div>
        </div>
      </div>

      {/* Repayment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-card p-6 shadow-2xl relative space-y-5">
            
            <button
              onClick={() => {
                setPaymentModalOpen(false);
                setPaymentSuccess(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>

            {!paymentSuccess ? (
              <>
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Instant EMI Repayment</h3>
                  <p className="text-xs text-slate-400">
                    Pay EMI #{loanDetails.paidInstallments + 1} for Personal Loan ({loanDetails.id})
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-surface-border bg-midnight-950 text-center">
                  <span className="text-xs text-slate-400 block font-mono">Amount Payable</span>
                  <span className="text-3xl font-black text-cyan-400 font-mono">
                    ₹{loanDetails.monthlyEmi.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Method Selector */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-mono">Select Payment Option:</span>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('upi')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedMethod === 'upi'
                          ? 'border-cyan-500 bg-cyan-950 text-white'
                          : 'border-surface-border bg-midnight-950 text-slate-400'
                      }`}
                    >
                      <QrCode className="h-4 w-4 mx-auto mb-1 text-cyan-400" />
                      <span>Instant UPI / QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('netbanking')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedMethod === 'netbanking'
                          ? 'border-cyan-500 bg-cyan-950 text-white'
                          : 'border-surface-border bg-midnight-950 text-slate-400'
                      }`}
                    >
                      <Landmark className="h-4 w-4 mx-auto mb-1 text-cyan-400" />
                      <span>Net Banking</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePayEmi}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-midnight-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      <span>Processing Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span>Authorize Payment of ₹{loanDetails.monthlyEmi.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
                  <p className="text-xs text-slate-300">
                    EMI installment of ₹{loanDetails.monthlyEmi.toLocaleString('en-IN')} has been acknowledged and recorded on the ledger.
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-surface-border bg-midnight-950 text-xs font-mono text-slate-400">
                  Transaction Ref: <span className="text-cyan-300 font-semibold">TL-TXN-2026-09A8F</span>
                </div>
                <button
                  onClick={() => {
                    setPaymentModalOpen(false);
                    setPaymentSuccess(false);
                    handleDownloadReceipt();
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold text-xs hover:bg-cyan-900 transition-colors"
                >
                  Download Acknowledgment Receipt
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
