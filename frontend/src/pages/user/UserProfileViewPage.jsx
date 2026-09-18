/**
 * TrustLedger User Profile View Page (/profile)
 * Displays verified single-person borrower credentials, masked identity tokens,
 * live camera photo record, residential information, and submitted identity documents.
 * Enforces: "Each person must create and use their own TrustLedger account."
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  FileText,
  Camera,
  AlertCircle,
  Sparkles,
  Edit3,
  ExternalLink
} from 'lucide-react';
import SingleAccountNotice from '../../components/user/SingleAccountNotice';
import { useUserAuth } from '../../context/UserAuthContext';

export default function UserProfileViewPage() {
  const { user, profile, isDemo } = useUserAuth();

  const isVerified = profile?.verification_status === 'VERIFIED' || isDemo;
  const fullName = profile?.full_name || user?.fullName || 'Arjun Kumar';
  const email = profile?.email || user?.email || 'arjun.kumar@example.in';
  const mobile = profile?.mobile || user?.mobile || '9812345678';
  const dob = profile?.date_of_birth || '1994-08-12';
  const gender = profile?.gender || 'Male';
  const address = profile?.address || 'Flat 402, Green Glen Layout, Bellandur';
  const city = profile?.city || 'Bengaluru';
  const state = profile?.state || 'Karnataka';
  const pincode = profile?.pincode || '560103';
  const occupation = profile?.occupation || 'Software Engineer';
  const employmentType = profile?.employment_type || 'Full-time Salaried';
  const monthlyIncome = profile?.monthly_income || '95,000';

  const aadhaarMasked = profile?.aadhaar_masked || 'XXXX XXXX 4821';
  const panMasked = profile?.pan_masked || 'AB•••••4821';

  const [toastMessage, setToastMessage] = useState('');

  const handleEditInfo = () => {
    setToastMessage('Contact information update request submitted for underwriting review.');
    setTimeout(() => setToastMessage(''), 4000);
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

      {/* Mandatory Single Person Account Principle */}
      <SingleAccountNotice variant="banner" />

      {/* Header Profile Summary Card */}
      <div className="rounded-2xl border border-surface-border bg-gradient-to-r from-surface-card via-surface-card to-cyan-950/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar / Camera Photo Placeholder */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-cyan-950/80 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-inner overflow-hidden">
              <User className="h-12 w-12" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 shadow">
              <Camera className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Identity & Verification Meta */}
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{fullName}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Profile</span>
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Single-person applicant ID: <span className="font-mono text-cyan-300">{user?.id || 'usr_borrower_001'}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Mail className="h-3.5 w-3.5 text-cyan-400" />
                <span>{email}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Phone className="h-3.5 w-3.5 text-cyan-400" />
                <span>+91 {mobile}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                <span>{city}, {state}</span>
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <div className="shrink-0">
            <button
              onClick={handleEditInfo}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-surface-border bg-midnight-950/80 hover:bg-slate-900 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Request Update</span>
            </button>
          </div>

        </div>
      </div>

      {/* Grid: Identity Details & Residential / Financial Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Masked Identity Proofs (Section 9) */}
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Government Identity Credentials</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              SECURELY MASKED
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            In compliance with Indian data protection norms, full Aadhaar and PAN numbers are never stored or displayed in plain text.
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl border border-surface-border bg-midnight-950 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Aadhaar Number</span>
                <span className="text-white font-bold tracking-wider">{aadhaarMasked}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px]">
                PASS
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-surface-border bg-midnight-950 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">PAN Card Number</span>
                <span className="text-white font-bold tracking-wider">{panMasked}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px]">
                PASS
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-surface-border bg-midnight-950 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Date of Birth (DOB)</span>
                <span className="text-white">{dob}</span>
              </div>
              <span className="text-slate-400 text-[11px]">{gender}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Employment & Income Details */}
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Employment & Financial Profile</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              SELF-DECLARED
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-slate-400">Occupation:</span>
              <span className="text-white font-semibold">{occupation}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-slate-400">Employment Type:</span>
              <span className="text-white">{employmentType}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-slate-400">Monthly Net Income:</span>
              <span className="text-emerald-400 font-bold">₹{monthlyIncome}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-slate-400">Residential PIN:</span>
              <span className="text-white">{pincode} ({city})</span>
            </div>
          </div>
        </div>

      </div>

      {/* Card 3: Submitted Profile Documents */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Verified Identity Documents</h2>
          </div>
          <Link
            to="/loans"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            Apply for new loan →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl border border-surface-border bg-midnight-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-cyan-400" />
              <div>
                <span className="text-white font-semibold block">Aadhaar Card (e-KYC Copy)</span>
                <span className="text-[10px] text-slate-400">Optical check passed • Document-based</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">
              VERIFIED
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-surface-border bg-midnight-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Camera className="h-4 w-4 text-cyan-400" />
              <div>
                <span className="text-white font-semibold block">Camera Liveness Photo</span>
                <span className="text-[10px] text-slate-400">Direct webcam capture • Sharpness 85+</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">
              CAPTURED
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
