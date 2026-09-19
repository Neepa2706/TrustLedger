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
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-coffee-200 bg-white text-xs text-coffee-900 shadow-2xl flex items-center gap-2 font-mono">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mandatory Single Person Account Principle */}
      <SingleAccountNotice variant="banner" />

      {/* Header Profile Summary Card */}
      <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar / Camera Photo Placeholder */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-coffee-50 border-2 border-coffee-200 flex items-center justify-center text-coffee-700 shadow-xs overflow-hidden">
              <User className="h-12 w-12" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs">
              <Camera className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Identity & Verification Meta */}
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-espresso tracking-tight">{fullName}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Profile</span>
              </span>
            </div>

            <p className="text-xs text-stone-500">
              Single-person applicant ID: <span className="font-mono text-coffee-700 font-semibold">{user?.id || 'usr_borrower_001'}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-stone-600">
              <span className="flex items-center gap-1.5 text-stone-600">
                <Mail className="h-3.5 w-3.5 text-coffee-700" />
                <span>{email}</span>
              </span>
              <span className="flex items-center gap-1.5 text-stone-600">
                <Phone className="h-3.5 w-3.5 text-coffee-700" />
                <span>+91 {mobile}</span>
              </span>
              <span className="flex items-center gap-1.5 text-stone-600">
                <MapPin className="h-3.5 w-3.5 text-coffee-700" />
                <span>{city}, {state}</span>
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <div className="shrink-0">
            <button
              onClick={handleEditInfo}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-coffee-200 bg-white hover:bg-coffee-50 text-xs font-mono text-stone-700 hover:text-espresso transition-colors shadow-xs"
            >
              <Edit3 className="h-3.5 w-3.5 text-coffee-700" />
              <span>Request Update</span>
            </button>
          </div>

        </div>
      </div>

      {/* Grid: Identity Details & Residential / Financial Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Masked Identity Proofs */}
        <div className="rounded-2xl border border-coffee-200 bg-white p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-coffee-700" />
              <h2 className="text-sm font-bold text-espresso">Government Identity Credentials</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              SECURELY MASKED
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            In compliance with Indian data protection norms, full Aadhaar and PAN numbers are never stored or displayed in plain text.
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl border border-coffee-100 bg-stone-50/80 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-stone-500 block">Aadhaar Number</span>
                <span className="text-espresso font-bold tracking-wider">{aadhaarMasked}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                PASS
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-coffee-100 bg-stone-50/80 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-stone-500 block">PAN Card Number</span>
                <span className="text-espresso font-bold tracking-wider">{panMasked}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                PASS
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-coffee-100 bg-stone-50/80 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-stone-500 block">Date of Birth (DOB)</span>
                <span className="text-espresso font-medium">{dob}</span>
              </div>
              <span className="text-stone-500 text-[11px]">{gender}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Employment & Income Details */}
        <div className="rounded-2xl border border-coffee-200 bg-white p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-coffee-700" />
              <h2 className="text-sm font-bold text-espresso">Employment & Financial Profile</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coffee-50 text-coffee-800 border border-coffee-200 font-medium">
              SELF-DECLARED
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-3 rounded-xl border border-coffee-100 bg-stone-50/80">
              <span className="text-stone-500">Occupation:</span>
              <span className="text-espresso font-semibold">{occupation}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl border border-coffee-100 bg-stone-50/80">
              <span className="text-stone-500">Employment Type:</span>
              <span className="text-espresso">{employmentType}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl border border-coffee-100 bg-stone-50/80">
              <span className="text-stone-500">Monthly Net Income:</span>
              <span className="text-emerald-700 font-bold">₹{monthlyIncome}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl border border-coffee-100 bg-stone-50/80">
              <span className="text-stone-500">Residential PIN:</span>
              <span className="text-espresso">{pincode} ({city})</span>
            </div>
          </div>
        </div>

      </div>

      {/* Card 3: Submitted Profile Documents */}
      <div className="rounded-2xl border border-coffee-200 bg-white p-6 space-y-4 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-coffee-700" />
            <h2 className="text-sm font-bold text-espresso">Verified Identity Documents</h2>
          </div>
          <Link
            to="/loans"
            className="text-xs font-mono text-coffee-700 hover:text-coffee-900 hover:underline font-medium"
          >
            Apply for new loan →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl border border-coffee-100 bg-stone-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-coffee-700" />
              <div>
                <span className="text-espresso font-semibold block">Aadhaar Card (e-KYC Copy)</span>
                <span className="text-[10px] text-stone-500">Optical check passed • Document-based</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              VERIFIED
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-coffee-100 bg-stone-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Camera className="h-4 w-4 text-coffee-700" />
              <div>
                <span className="text-espresso font-semibold block">Camera Liveness Photo</span>
                <span className="text-[10px] text-stone-500">Direct webcam capture • Sharpness 85+</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              CAPTURED
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
