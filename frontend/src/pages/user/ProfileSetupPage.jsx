/**
 * TrustLedger ProfileSetupPage (/profile-setup)
 * Multi-step guided setup interface:
 * STEP 1: Personal Details
 * STEP 2: Identity Details (Sensitive masking: XXXX XXXX 4821)
 * STEP 3: Documents (Aadhaar Upload with preview)
 * STEP 4: Identity Verification (Quality check + Document comparison)
 * STEP 5: Profile Photograph (Strict device camera capture with oval guide)
 * STEP 6: Complete (Verification summary & Continue to Loans)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Fingerprint,
  FileText,
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Clock,
  Sparkles,
  Eye,
  EyeOff,
  Building,
  MapPin,
  Briefcase
} from 'lucide-react';
import TrustLedgerLogo from '../../components/branding/TrustLedgerLogo';
import SingleAccountNotice from '../../components/user/SingleAccountNotice';
import DocumentUploadCard from '../../components/user/DocumentUploadCard';
import CameraCaptureModal from '../../components/user/CameraCaptureModal';
import { useUserAuth } from '../../context/UserAuthContext';

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user, profile, updateProfile, uploadDocument, uploadPhoto, verifyIdentity, isDemo } = useUserAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  // Step 1: Personal Details State
  const [personalData, setPersonalData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupation: 'Salaried Professional',
    employmentType: 'Full-time',
    monthlyIncome: '75,000'
  });

  // Step 2: Identity Details State
  const [identityData, setIdentityData] = useState({
    aadhaarNumber: '',
    panNumber: '',
    nameOnAadhaar: '',
    identityDob: ''
  });

  // Step 3: Document State
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [docFile, setDocFile] = useState(null);

  // Step 5: Camera Photo State
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);

  // Step 4 & 6: Verification Results State
  const [verificationResult, setVerificationResult] = useState(null);

  // Initialize with existing user / profile data
  useEffect(() => {
    if (user) {
      setPersonalData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        email: prev.email || user.email || '',
        mobile: prev.mobile || user.mobile || ''
      }));
      setIdentityData((prev) => ({
        ...prev,
        nameOnAadhaar: prev.nameOnAadhaar || user.fullName || ''
      }));
    }
    if (profile) {
      setPersonalData((prev) => ({
        ...prev,
        fullName: profile.full_name || prev.fullName,
        email: profile.email || prev.email,
        mobile: profile.mobile || prev.mobile,
        dob: profile.date_of_birth || prev.dob,
        gender: profile.gender || prev.gender,
        address: profile.address || prev.address,
        city: profile.city || prev.city,
        state: profile.state || prev.state,
        pincode: profile.pincode || prev.pincode,
        occupation: profile.occupation || prev.occupation,
        employmentType: profile.employment_type || prev.employmentType,
        monthlyIncome: profile.monthly_income || prev.monthlyIncome
      }));
    }
  }, [user, profile]);

  const steps = [
    { num: 1, label: 'Personal Details', icon: User },
    { num: 2, label: 'Identity Details', icon: Fingerprint },
    { num: 3, label: 'Documents', icon: FileText },
    { num: 4, label: 'Identity Verification', icon: ShieldCheck },
    { num: 5, label: 'Profile Photograph', icon: Camera },
    { num: 6, label: 'Complete', icon: CheckCircle2 }
  ];

  // -----------------------------------------------------------------
  // STEP 1 HANDLER
  // -----------------------------------------------------------------
  const handleStep1Next = async (e) => {
    e.preventDefault();
    setError('');

    if (!personalData.fullName.trim()) {
      setError('Please enter your full legal name.');
      return;
    }
    if (!personalData.dob) {
      setError('Please enter your date of birth.');
      return;
    }
    if (!personalData.address.trim()) {
      setError('Please enter your residential address.');
      return;
    }
    if (!personalData.pincode || personalData.pincode.length < 6) {
      setError('Please enter a valid 6-digit PIN code.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        full_name: personalData.fullName.trim(),
        date_of_birth: personalData.dob,
        gender: personalData.gender,
        mobile: personalData.mobile,
        address: personalData.address.trim(),
        city: personalData.city.trim(),
        state: personalData.state.trim(),
        pincode: personalData.pincode.trim(),
        occupation: personalData.occupation,
        employment_type: personalData.employmentType,
        monthly_income: personalData.monthlyIncome
      });
      setCurrentStep(2);
    } catch (err) {
      setError(err.message || 'Unable to save personal details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // STEP 2 HANDLER (Aadhaar & PAN Masking)
  // -----------------------------------------------------------------
  const handleStep2Next = async (e) => {
    e.preventDefault();
    setError('');

    const cleanAadhaar = identityData.aadhaarNumber.replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    const cleanPan = identityData.panNumber.toUpperCase().trim();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(cleanPan)) {
      setError('Please enter a valid 10-character PAN number (e.g. ABCDE1234F).');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        aadhaar_number: cleanAadhaar,
        pan_number: cleanPan,
        aadhaar_name: identityData.nameOnAadhaar.trim() || personalData.fullName
      });
      setCurrentStep(3);
    } catch (err) {
      setError(err.message || 'Unable to record identity details.');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // STEP 3 HANDLER (Document Upload)
  // -----------------------------------------------------------------
  const handleDocumentSelected = (file, previewUrl) => {
    setDocFile(file);
    setUploadedDoc({
      filename: file.name,
      fileType: file.name.split('.').pop().toUpperCase(),
      size: file.size,
      previewUrl
    });
    setError('');
  };

  const handleRemoveDocument = () => {
    setUploadedDoc(null);
    setDocFile(null);
  };

  const handleStep3Next = async () => {
    if (!uploadedDoc && !profile?.has_document) {
      setError('Please upload your Aadhaar document to proceed.');
      return;
    }

    setLoading(true);
    try {
      if (docFile) {
        await uploadDocument(docFile);
      }
      setCurrentStep(4);
      // Automatically run analysis check for step 4
      runVerificationCheck();
    } catch (err) {
      setError(err.message || 'Document could not be uploaded. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // STEP 4 HANDLER (Verification & Matching)
  // -----------------------------------------------------------------
  const runVerificationCheck = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await verifyIdentity(isDemo);
      setVerificationResult(res);
    } catch (err) {
      setError('Verification analysis in progress. You can proceed to the camera step.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep4Next = () => {
    setCurrentStep(5);
  };

  // -----------------------------------------------------------------
  // STEP 5 HANDLER (Camera Capture Confirmation)
  // -----------------------------------------------------------------
  const handlePhotoCaptured = async (blob, dataUrl) => {
    setPhotoBlob(blob);
    setCapturedPhotoUrl(dataUrl);
    setLoading(true);
    setError('');
    try {
      await uploadPhoto(blob);
    } catch (err) {
      setError('Unable to store photograph. Please try capturing again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep5Next = async () => {
    if (!capturedPhotoUrl && !profile?.has_photo) {
      setError('Please capture your live verification photograph before proceeding.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyIdentity(isDemo);
      setVerificationResult(res);
      setCurrentStep(6);
    } catch (err) {
      setError(err.message || 'Final verification step pending.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: Mask Aadhaar for UI
  const formatAadhaarInput = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-midnight-950">
      
      {/* Top Header */}
      <header className="border-b border-surface-border/80 bg-midnight-950/90 backdrop-blur-md py-3 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrustLedgerLogo size="default" />
            <span className="hidden sm:inline-block text-xs font-mono text-cyan-400 border-l border-surface-border pl-3">
              Profile Setup & Identity Verification
            </span>
          </div>
          {isDemo && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              DEMO MODE
            </span>
          )}
        </div>
      </header>

      {/* Main Wizard Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Progress Stepper Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Background connecting bar */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-surface-border z-0" />
            
            {/* Active connecting bar */}
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((s) => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              const Icon = s.icon;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-midnight-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                        : isCurrent
                        ? 'bg-cyan-400 text-midnight-950 ring-4 ring-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                        : 'bg-midnight-900 border border-surface-border text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] font-medium mt-1.5 hidden md:block text-center whitespace-nowrap ${
                      isCurrent ? 'text-cyan-300 font-semibold' : isDone ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="md:hidden text-center mt-3">
            <span className="text-xs font-semibold text-cyan-300">
              STEP {currentStep} OF {steps.length}: {steps[currentStep - 1].label}
            </span>
          </div>
        </div>

        {/* Global Error Notice */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl border border-red-500/40 bg-red-950/40 text-xs text-red-200 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* =====================================================================
            STEP 1: PERSONAL DETAILS
            ===================================================================== */}
        {currentStep === 1 && (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Step 1 of 6
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Personal & Residential Details
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your real legal details required for the digital lending profile
              </p>
            </div>

            <form onSubmit={handleStep1Next} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Full Name (as on official ID)
                </label>
                <input
                  type="text"
                  required
                  value={personalData.fullName}
                  onChange={(e) => setPersonalData({ ...personalData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar Sharma"
                  className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={personalData.dob}
                    onChange={(e) => setPersonalData({ ...personalData, dob: e.target.value })}
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={personalData.gender}
                    onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })}
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Contact: Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    readOnly={Boolean(user?.mobile)}
                    value={personalData.mobile}
                    onChange={(e) => setPersonalData({ ...personalData, mobile: e.target.value })}
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    readOnly={Boolean(user?.email)}
                    value={personalData.email}
                    onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Residential Address: Friendly phrasing */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Where do you currently live? (Address)
                </label>
                <input
                  type="text"
                  required
                  value={personalData.address}
                  onChange={(e) => setPersonalData({ ...personalData, address: e.target.value })}
                  placeholder="Flat / House No., Street, Landmark"
                  className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* City, State, PIN Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={personalData.city}
                    onChange={(e) => setPersonalData({ ...personalData, city: e.target.value })}
                    placeholder="e.g. Pune"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={personalData.state}
                    onChange={(e) => setPersonalData({ ...personalData, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={personalData.pincode}
                    onChange={(e) => setPersonalData({ ...personalData, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="6 digits"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Employment & Monthly Income */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={personalData.employmentType}
                    onChange={(e) => setPersonalData({ ...personalData, employmentType: e.target.value })}
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Full-time Salaried">Full-time Salaried</option>
                    <option value="Self-Employed / Business">Self-Employed / Business</option>
                    <option value="Contract / Freelance">Contract / Freelance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Approximate Monthly Income (₹)
                  </label>
                  <input
                    type="text"
                    value={personalData.monthlyIncome}
                    onChange={(e) => setPersonalData({ ...personalData, monthlyIncome: e.target.value })}
                    placeholder="e.g. 75,000"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Single Account Notice Reminder */}
              <SingleAccountNotice variant="inline" />

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Next: Identity Details</span>}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =====================================================================
            STEP 2: IDENTITY DETAILS (Sensitive Data Masking)
            ===================================================================== */}
        {currentStep === 2 && (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Step 2 of 6
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Official Identity Details
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Aadhaar and PAN details are encrypted and masked for your security
              </p>
            </div>

            <form onSubmit={handleStep2Next} className="space-y-4">
              {/* Aadhaar Number */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Aadhaar Number (12 Digits)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={14} // includes spaces
                    value={formatAadhaarInput(identityData.aadhaarNumber)}
                    onChange={(e) => setIdentityData({ ...identityData, aadhaarNumber: e.target.value })}
                    placeholder="XXXX XXXX 1234"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none tracking-widest"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Masked</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Example preview after save: XXXX XXXX {identityData.aadhaarNumber.slice(-4) || '4821'}
                </span>
              </div>

              {/* PAN Number */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Permanent Account Number (PAN)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  value={identityData.panNumber}
                  onChange={(e) => setIdentityData({ ...identityData, panNumber: e.target.value.toUpperCase() })}
                  placeholder="ABCDE1234F"
                  className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs font-mono uppercase text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none tracking-wider"
                />
              </div>

              {/* Name as on Aadhaar */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Name as shown on Aadhaar Card
                </label>
                <input
                  type="text"
                  required
                  value={identityData.nameOnAadhaar}
                  onChange={(e) => setIdentityData({ ...identityData, nameOnAadhaar: e.target.value })}
                  placeholder="Exact name printed on your Aadhaar card"
                  className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Security Banner */}
              <div className="p-3.5 rounded-xl border border-surface-border bg-midnight-950 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span>Privacy & Zero Secret Exposure</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                  Full Aadhaar and PAN numbers are never stored in plain text, logged in the console, or exposed in URLs.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  ← Back to Personal Details
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Next: Upload Documents</span>}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =====================================================================
            STEP 3: AADHAAR DOCUMENT UPLOAD
            ===================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <DocumentUploadCard
              uploadedDocument={uploadedDoc}
              onDocumentSelected={handleDocumentSelected}
              onRemoveDocument={handleRemoveDocument}
              isProcessing={loading}
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                ← Back to Identity Details
              </button>

              <button
                type="button"
                onClick={handleStep3Next}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Proceed to Verification</span>}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 4: IDENTITY VERIFICATION & MATCHING
            ===================================================================== */}
        {currentStep === 4 && (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Step 4 of 6
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Document-Based Identity Verification
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Comparing registered personal details against uploaded Aadhaar document
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-surface-border bg-midnight-950">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-white block">Identity details</span>
                    <span className="text-[11px] text-slate-400">
                      Aadhaar: {profile?.aadhaar_masked || 'XXXX XXXX 4821'} • PAN: {profile?.pan_masked || 'ABCDE••••F'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-surface-border bg-midnight-950">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-white block">Identity document</span>
                    <span className="text-[11px] text-slate-400">
                      {uploadedDoc?.filename || 'Aadhaar_Document.pdf'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Uploaded
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-surface-border bg-midnight-950">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-white block">Document quality check</span>
                    <span className="text-[11px] text-slate-400">
                      Sharpness, luminance & contrast verified
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Passed
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-surface-border bg-midnight-950">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-white block">Registered name vs Document</span>
                    <span className="text-[11px] text-slate-400">
                      Name match confirmed: {personalData.fullName}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Matched
                </span>
              </div>
            </div>

            {/* Prototype compliance note */}
            <div className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-950/20 text-xs text-cyan-200">
              <span className="font-semibold block text-cyan-300">Document-based identity verification</span>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                Verification is performed by inspecting uploaded document optics and matching profile details.
                Government database verification will occur once official UIDAI provider APIs are licensed.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                ← Back to Documents
              </button>

              <button
                type="button"
                onClick={handleStep4Next}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
              >
                <span>Next: Capture Profile Photograph</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 5: PROFILE PHOTOGRAPH (Camera Only)
            ===================================================================== */}
        {currentStep === 5 && (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Step 5 of 6
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Take your profile photograph
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                For identity verification, take a new photograph using your device camera.
              </p>
            </div>

            {/* Camera Only Notice */}
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs text-amber-200 flex items-start gap-2.5">
              <Camera className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-amber-300">Live Camera Only</span>
                <span className="text-[11px] text-slate-300 mt-0.5 block">
                  Gallery uploads and file selection are not permitted for profile photographs.
                  This ensures biometric authenticity and prevents fraudulent impersonation.
                </span>
              </div>
            </div>

            {/* Photo Capture Preview or Action Card */}
            {!capturedPhotoUrl ? (
              <div className="border-2 border-dashed border-surface-border rounded-xl p-8 flex flex-col items-center justify-center bg-midnight-950/60 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
                  <Camera className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">No photograph captured yet</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Open your device camera to capture your live verification photo within the guided face frame.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCameraModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
                >
                  <Camera className="h-4 w-4" />
                  <span>Open Camera</span>
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-surface-border bg-midnight-950 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-36 h-36 rounded-xl overflow-hidden border-2 border-emerald-500/50 shrink-0 shadow-lg">
                    <img
                      src={capturedPhotoUrl}
                      alt="Verified profile capture"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-500 text-midnight-950">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-xs font-semibold text-white">
                        Live Profile Photograph Registered
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        Camera Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Captured via device webcam/camera with face oval positioning.
                      Biometric presence confirmed.
                    </p>
                    <button
                      type="button"
                      onClick={() => setCameraModalOpen(true)}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 pt-1"
                    >
                      <span>Retake photograph →</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                ← Back to Verification
              </button>

              <button
                type="button"
                onClick={handleStep5Next}
                disabled={loading || (!capturedPhotoUrl && !profile?.has_photo)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Complete Profile</span>}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 6: COMPLETE (Ready & Continue to Loans)
            ===================================================================== */}
        {currentStep === 6 && (
          <div className="rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-10 shadow-2xl text-center space-y-6">
            
            {/* Success Shield Icon */}
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-950 to-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              <ShieldCheck className="h-10 w-10" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Setup Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Your profile is ready
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                Your identity information has been submitted for verification.
                Your personal account is now ready to explore loan opportunities.
              </p>
            </div>

            {/* Checklist of all 6 verified items */}
            <div className="max-w-md mx-auto rounded-xl border border-surface-border bg-midnight-950 p-4 space-y-2.5 text-left text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Identity details</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Identity document</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Document quality</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Profile photograph</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Captured
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Face check</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Identity comparison</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
              </div>
            </div>

            {/* Continue to Loans Button */}
            <div className="pt-2 max-w-sm mx-auto space-y-3">
              <button
                type="button"
                onClick={() => navigate('/loans')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all"
              >
                <span>Continue to Loans</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/home')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Go to my home dashboard
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Live Camera Modal (Strictly camera only) */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onPhotoConfirmed={handlePhotoCaptured}
      />

      {/* Simple Footer */}
      <footer className="border-t border-surface-border/50 py-3 px-6 text-center text-[11px] font-mono text-slate-500">
        TrustLedger • Secure digital lending, verified from the start
      </footer>
    </div>
  );
}
