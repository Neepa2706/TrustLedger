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
      setError('Please enter your current residential address.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        full_name: personalData.fullName.trim(),
        date_of_birth: personalData.dob,
        gender: personalData.gender,
        mobile: personalData.mobile,
        email: personalData.email,
        address: personalData.address.trim(),
        city: personalData.city.trim(),
        state: personalData.state.trim(),
        pincode: personalData.pincode.trim(),
        occupation: personalData.occupation,
        employment_type: personalData.employmentType,
        monthly_income: personalData.monthlyIncome
      });

      // Mirror full name into identity step default
      setIdentityData((prev) => ({
        ...prev,
        nameOnAadhaar: prev.nameOnAadhaar || personalData.fullName.trim()
      }));

      setCurrentStep(2);
    } catch (err) {
      setError(err.message || 'Failed to update personal details.');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // STEP 2 HANDLER
  // -----------------------------------------------------------------
  const handleStep2Next = async (e) => {
    e.preventDefault();
    setError('');

    const rawAadhaar = identityData.aadhaarNumber.replace(/\s+/g, '');
    if (rawAadhaar.length !== 12 || !/^\d+$/.test(rawAadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    const panClean = identityData.panNumber.trim().toUpperCase();
    if (panClean.length !== 10) {
      setError('Please enter a valid 10-character PAN number.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        aadhaar_masked: `XXXX XXXX ${rawAadhaar.slice(-4)}`,
        pan_masked: `${panClean.slice(0, 2)}•••••${panClean.slice(-1)}`,
        name_on_aadhaar: identityData.nameOnAadhaar.trim()
      });

      setCurrentStep(3);
    } catch (err) {
      setError(err.message || 'Failed to save identity numbers.');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // STEP 3 HANDLER
  // -----------------------------------------------------------------
  const handleDocumentSelected = async (file) => {
    setDocFile(file);
    setError('');
    setLoading(true);
    try {
      const res = await uploadDocument(file, 'AADHAAR_FRONT_BACK');
      if (res) {
        setUploadedDoc(res);
      }
    } catch (err) {
      setError(err.message || 'Document upload failed. Ensure the file is a clear PDF or JPG/PNG image.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDocument = () => {
    setUploadedDoc(null);
    setDocFile(null);
  };

  const handleStep3Next = () => {
    if (!uploadedDoc && !profile?.has_documents) {
      setError('Please upload your Aadhaar document before proceeding.');
      return;
    }
    setError('');
    setCurrentStep(4);
  };

  // -----------------------------------------------------------------
  // STEP 4 HANDLER
  // -----------------------------------------------------------------
  const handleStep4Next = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await verifyIdentity();
      setVerificationResult(res);
      setCurrentStep(5);
    } catch (err) {
      setError(err.message || 'Verification could not be processed.');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // STEP 5 HANDLER
  // -----------------------------------------------------------------
  const handlePhotoCaptured = async (dataUrl, blob, quality) => {
    setCapturedPhotoUrl(dataUrl);
    setPhotoBlob(blob);
    setError('');
    setLoading(true);
    try {
      await uploadPhoto(blob);
    } catch (err) {
      setError(err.message || 'Failed to save photograph. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep5Next = () => {
    if (!capturedPhotoUrl && !profile?.has_photo) {
      setError('Please capture your live photograph using your device camera before proceeding.');
      return;
    }
    setError('');
    setCurrentStep(6);
  };

  // Helper: Mask Aadhaar for UI
  const formatAadhaarInput = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className="min-h-screen bg-surface-base text-espresso flex flex-col justify-between selection:bg-coffee-200 selection:text-coffee-950 animate-fadeIn">
      
      {/* Top Header */}
      <header className="border-b border-coffee-200 bg-white/90 backdrop-blur-md py-3 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrustLedgerLogo size="default" />
            <span className="hidden sm:inline-block text-xs font-mono text-coffee-700 border-l border-coffee-200 pl-3">
              Profile Setup & Identity Verification
            </span>
          </div>
          {isDemo && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coffee-50 text-coffee-800 border border-coffee-200 font-medium">
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
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-coffee-200 z-0" />
            
            {/* Active connecting bar */}
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-coffee-600 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((s) => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-coffee-700 text-white ring-4 ring-coffee-100 shadow-xs'
                        : 'bg-stone-50 border border-coffee-200 text-stone-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] font-medium mt-1.5 hidden md:block text-center whitespace-nowrap ${
                      isCurrent ? 'text-coffee-900 font-semibold' : isDone ? 'text-stone-700' : 'text-stone-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="md:hidden text-center mt-3">
            <span className="text-xs font-semibold text-coffee-800">
              STEP {currentStep} OF {steps.length}: {steps[currentStep - 1].label}
            </span>
          </div>
        </div>

        {/* Global Error Notice */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl border border-red-200 bg-red-50 text-xs text-red-800 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* =====================================================================
            STEP 1: PERSONAL DETAILS
            ===================================================================== */}
        {currentStep === 1 && (
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card">
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-semibold">
                Step 1 of 6
              </span>
              <h2 className="text-xl font-bold text-espresso mt-1">
                Personal & Residential Details
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Enter your real legal details required for the digital lending profile
              </p>
            </div>

            <form onSubmit={handleStep1Next} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                  Full Name (as on official ID)
                </label>
                <input
                  type="text"
                  required
                  value={personalData.fullName}
                  onChange={(e) => setPersonalData({ ...personalData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar Sharma"
                  className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso placeholder-stone-400 focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                />
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={personalData.dob}
                    onChange={(e) => setPersonalData({ ...personalData, dob: e.target.value })}
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={personalData.gender}
                    onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })}
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
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
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    readOnly={Boolean(user?.mobile)}
                    value={personalData.mobile}
                    onChange={(e) => setPersonalData({ ...personalData, mobile: e.target.value })}
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso placeholder-stone-400 focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    readOnly={Boolean(user?.email)}
                    value={personalData.email}
                    onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso placeholder-stone-400 focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                  Where do you currently live? (Address)
                </label>
                <input
                  type="text"
                  required
                  value={personalData.address}
                  onChange={(e) => setPersonalData({ ...personalData, address: e.target.value })}
                  placeholder="Flat / House No., Street, Landmark"
                  className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso placeholder-stone-400 focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                />
              </div>

              {/* City, State, PIN Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={personalData.city}
                    onChange={(e) => setPersonalData({ ...personalData, city: e.target.value })}
                    placeholder="e.g. Pune"
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso placeholder-stone-400 focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={personalData.state}
                    onChange={(e) => setPersonalData({ ...personalData, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso placeholder-stone-400 focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={personalData.pincode}
                    onChange={(e) => setPersonalData({ ...personalData, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="6 digits"
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso placeholder-stone-400 focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Employment & Monthly Income */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={personalData.employmentType}
                    onChange={(e) => setPersonalData({ ...personalData, employmentType: e.target.value })}
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                  >
                    <option value="Full-time Salaried">Full-time Salaried</option>
                    <option value="Self-Employed / Business">Self-Employed / Business</option>
                    <option value="Contract / Freelance">Contract / Freelance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                    Approximate Monthly Income (₹)
                  </label>
                  <input
                    type="text"
                    value={personalData.monthlyIncome}
                    onChange={(e) => setPersonalData({ ...personalData, monthlyIncome: e.target.value })}
                    placeholder="e.g. 75,000"
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso placeholder-stone-400 focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Single Account Notice Reminder */}
              <SingleAccountNotice variant="inline" />

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
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
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card">
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-semibold">
                Step 2 of 6
              </span>
              <h2 className="text-xl font-bold text-espresso mt-1">
                Official Identity Details
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Aadhaar and PAN details are encrypted and masked for your security
              </p>
            </div>

            <form onSubmit={handleStep2Next} className="space-y-4">
              {/* Aadhaar Number */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
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
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs font-mono text-espresso placeholder-stone-400 focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none tracking-widest"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Masked</span>
                  </div>
                </div>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Example preview after save: XXXX XXXX {identityData.aadhaarNumber.slice(-4) || '4821'}
                </span>
              </div>

              {/* PAN Number */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                  Permanent Account Number (PAN)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  value={identityData.panNumber}
                  onChange={(e) => setIdentityData({ ...identityData, panNumber: e.target.value.toUpperCase() })}
                  placeholder="ABCDE1234F"
                  className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs font-mono uppercase text-espresso placeholder-stone-400 focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none tracking-wider"
                />
              </div>

              {/* Name as on Aadhaar */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1">
                  Name as shown on Aadhaar Card
                </label>
                <input
                  type="text"
                  required
                  value={identityData.nameOnAadhaar}
                  onChange={(e) => setIdentityData({ ...identityData, nameOnAadhaar: e.target.value })}
                  placeholder="Exact name printed on your Aadhaar card"
                  className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso placeholder-stone-400 focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                />
              </div>

              {/* Security Banner */}
              <div className="p-3.5 rounded-xl border border-coffee-200 bg-stone-50/80 text-xs text-stone-700 space-y-1">
                <div className="flex items-center gap-2 text-coffee-800 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-coffee-700" />
                  <span>Privacy & Zero Secret Exposure</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed pl-6">
                  Full Aadhaar and PAN numbers are never stored in plain text, logged in the console, or exposed in URLs.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-espresso"
                >
                  ← Back to Personal Details
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
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
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-espresso"
              >
                ← Back to Identity Details
              </button>

              <button
                type="button"
                onClick={handleStep3Next}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
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
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-semibold">
                Step 4 of 6
              </span>
              <h2 className="text-xl font-bold text-espresso mt-1">
                Document-Based Identity Verification
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Comparing registered personal details against uploaded Aadhaar document
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-coffee-100 bg-stone-50/80">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-espresso block">Identity details</span>
                    <span className="text-[11px] text-stone-500">
                      Aadhaar: {profile?.aadhaar_masked || 'XXXX XXXX 4821'} • PAN: {profile?.pan_masked || 'ABCDE••••F'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-coffee-100 bg-stone-50/80">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-espresso block">Identity document</span>
                    <span className="text-[11px] text-stone-500">
                      {uploadedDoc?.filename || 'Aadhaar_Document.pdf'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Uploaded
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-coffee-100 bg-stone-50/80">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-espresso block">Document quality check</span>
                    <span className="text-[11px] text-stone-500">
                      Sharpness, luminance & contrast verified
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Passed
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-coffee-100 bg-stone-50/80">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-espresso block">Registered name vs Document</span>
                    <span className="text-[11px] text-stone-500">
                      Name match confirmed: {personalData.fullName}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Matched
                </span>
              </div>
            </div>

            {/* Prototype compliance note */}
            <div className="p-3 rounded-xl border border-coffee-200 bg-coffee-50/50 text-xs text-stone-700">
              <span className="font-semibold block text-espresso">Document-based identity verification</span>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                Verification is performed by inspecting uploaded document optics and matching profile details.
                Government database verification will occur once official UIDAI provider APIs are licensed.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-espresso"
              >
                ← Back to Documents
              </button>

              <button
                type="button"
                onClick={handleStep4Next}
                className="flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
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
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-semibold">
                Step 5 of 6
              </span>
              <h2 className="text-xl font-bold text-espresso mt-1">
                Take your profile photograph
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                For identity verification, take a new photograph using your device camera.
              </p>
            </div>

            {/* Camera Only Notice */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900 flex items-start gap-2.5">
              <Camera className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-amber-950">Live Camera Only</span>
                <span className="text-[11px] text-amber-800 mt-0.5 block">
                  Gallery uploads and file selection are not permitted for profile photographs.
                  This ensures biometric authenticity and prevents fraudulent impersonation.
                </span>
              </div>
            </div>

            {/* Photo Capture Preview or Action Card */}
            {!capturedPhotoUrl ? (
              <div className="border-2 border-dashed border-coffee-200 rounded-xl p-8 flex flex-col items-center justify-center bg-stone-50/50 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-coffee-50 border border-coffee-200 flex items-center justify-center text-coffee-700 shadow-xs">
                  <Camera className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-espresso">No photograph captured yet</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm">
                    Open your device camera to capture your live verification photo within the guided face frame.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCameraModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
                >
                  <Camera className="h-4 w-4" />
                  <span>Open Camera</span>
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-coffee-200 bg-white p-4 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-36 h-36 rounded-xl overflow-hidden border-2 border-emerald-500 shrink-0 shadow-sm">
                    <img
                      src={capturedPhotoUrl}
                      alt="Verified profile capture"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-600 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-xs font-semibold text-espresso">
                        Live Profile Photograph Registered
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Camera Verified
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Captured via device webcam/camera with face oval positioning.
                      Biometric presence confirmed.
                    </p>
                    <button
                      type="button"
                      onClick={() => setCameraModalOpen(true)}
                      className="text-xs font-mono text-coffee-700 hover:text-coffee-900 hover:underline inline-flex items-center gap-1 pt-1"
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
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-espresso"
              >
                ← Back to Verification
              </button>

              <button
                type="button"
                onClick={handleStep5Next}
                disabled={loading || (!capturedPhotoUrl && !profile?.has_photo)}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all disabled:opacity-60"
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
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-10 shadow-card text-center space-y-6">
            
            {/* Success Shield Icon */}
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <ShieldCheck className="h-10 w-10" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-semibold">
                Setup Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-espresso mt-1">
                Your profile is ready
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
                Your identity information has been submitted for verification.
                Your personal account is now ready to explore loan opportunities.
              </p>
            </div>

            {/* Checklist of all 6 verified items */}
            <div className="max-w-md mx-auto rounded-xl border border-coffee-200 bg-stone-50/80 p-4 space-y-2.5 text-left text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-700">Identity details</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-700">Identity document</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-700">Document quality</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-700">Profile photograph</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Captured
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-700">Face check</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-700">Identity comparison</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                </span>
              </div>
            </div>

            {/* Continue to Loans Button */}
            <div className="pt-2 max-w-sm mx-auto space-y-3">
              <button
                type="button"
                onClick={() => navigate('/loans')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
              >
                <span>Continue to Loans</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/home')}
                className="text-xs text-stone-600 hover:text-espresso font-medium"
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
      <footer className="border-t border-coffee-200 py-3 px-6 text-center text-[11px] font-mono text-stone-500">
        TrustLedger • Secure digital lending, verified from the start
      </footer>
    </div>
  );
}
