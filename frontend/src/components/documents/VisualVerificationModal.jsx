import React, { useState, useRef, useEffect } from 'react';
import { Camera, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, X, Hash, UserCheck, Lock, Sparkles } from 'lucide-react';

export default function VisualVerificationModal({
  isOpen,
  onClose,
  applicantName = 'Rahul Verma',
  applicationId = 'APP-1003',
  onVerificationSuccess,
  onVerificationFailed
}) {
  const [streamActive, setStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [shaHash, setShaHash] = useState('');
  const [scanning, setScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null); // 'matched' | 'mismatched'
  const [matchConfidence, setMatchConfidence] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStreamActive(true);
        }
      }
    } catch {
      // Fallback to simulated live feed if camera permission denied or no webcam
      setStreamActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  // Compute real SHA-256 hash using Web Crypto API
  const computeSha256 = async (imageDataUrl) => {
    try {
      const msgBuffer = new TextEncoder().encode(imageDataUrl);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch {
      return `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;
    }
  };

  const handleCapture = async () => {
    setScanning(true);
    let dataUrl = null;

    if (streamActive && videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      dataUrl = canvas.toDataURL('image/jpeg');
    } else {
      // High-resolution simulated biometric frame capture for testing
      dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="#0b1324">
          <rect width="400" height="300" fill="#0b1324"/>
          <circle cx="200" cy="120" r="55" fill="#1e293b" stroke="#00f0ff" stroke-width="2"/>
          <path d="M120 260 C120 200, 280 200, 280 260" fill="#1e293b" stroke="#00f0ff" stroke-width="2"/>
          <text x="200" y="285" fill="#94a3b8" font-family="monospace" font-size="12" text-anchor="middle">BIOMETRIC LIVENESS FRAME: ${applicationId}</text>
        </svg>
      `);
    }

    setCapturedImage(dataUrl);
    stopCamera();

    // Generate SHA-256 hash
    const hash = await computeSha256(dataUrl);
    setShaHash(hash);
    setScanning(false);
  };

  const handleVerifyMatch = (forceMatch = true) => {
    if (forceMatch) {
      setMatchConfidence(96.4);
      setVerificationResult('matched');
      setTimeout(() => {
        onVerificationSuccess({
          photo: capturedImage,
          hash: shaHash,
          confidence: 96.4,
          timestamp: new Date().toISOString()
        });
      }, 900);
    } else {
      setMatchConfidence(32.8);
      setVerificationResult('mismatched');
      setTimeout(() => {
        onVerificationFailed({
          reason: 'Biometric visual face mismatch with registered applicant identity.',
          confidence: 32.8,
          timestamp: new Date().toISOString()
        });
      }, 1200);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShaHash('');
    setVerificationResult(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/40 bg-surface-card p-6 shadow-[0_0_50px_rgba(0,240,255,0.15)] text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Applicant Biometric Face Verification
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold">
                  APPLICANT ONBOARDING STEP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulating the live applicant selfie checkpoint for <span className="text-cyan-300 font-semibold">{applicantName}</span> ({applicationId}) before loan documents are unlocked.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Applicant Context Callout */}
        <div className="mt-3 px-3 py-2 rounded-lg bg-midnight-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>ROLE: <strong className="text-white">Loan Applicant Verification Flow</strong></span>
          <span className="text-cyan-400">Identity Target: {applicantName}</span>
        </div>

        {/* Camera Viewport & Capture Stage */}
        <div className="my-4">
          {!capturedImage ? (
            <div className="relative rounded-xl border border-surface-border bg-midnight-950 overflow-hidden aspect-video flex flex-col items-center justify-center">
              {streamActive ? (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-center p-6 space-y-3">
                  <div className="h-16 w-16 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-pulse">
                    <Camera className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      Applicant Liveness Camera Ready
                    </span>
                    <span className="text-xs text-slate-400 max-w-sm block mt-1">
                      Webcam stream ready or simulated applicant biometric frame active. Position applicant face within the reticle.
                    </span>
                  </div>
                </div>
              )}

              {/* Cyber Scanner Overlay Guide */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-64 border-2 border-dashed border-cyan-400/70 rounded-full flex items-center justify-center relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-cyan-950/90 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/40">
                    APPLICANT LIVENESS SCANNER
                  </div>
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[pulse_2s_infinite]"></div>
                </div>
              </div>

              {/* Capture Control Button */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  onClick={handleCapture}
                  disabled={scanning}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                >
                  <Camera className="h-4 w-4" />
                  <span>Capture Applicant Face</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Split Comparison View: Captured Face vs Registered ID Photo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-surface-border bg-midnight-950 p-3 flex flex-col items-center">
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-2">
                    Applicant Live Capture
                  </div>
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-cyan-500/40 bg-slate-900 flex items-center justify-center">
                    <img src={capturedImage} alt="Captured applicant face" className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-2 text-center text-[10px] font-mono text-cyan-300">
                    Applicant Liveness: 99.8%
                  </div>
                </div>

                <div className="rounded-xl border border-surface-border bg-midnight-950 p-3 flex flex-col items-center">
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-2">
                    Applicant PAN/Aadhaar Baseline
                  </div>
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center text-slate-400">
                    <div className="flex flex-col items-center justify-center p-3 text-center">
                      <UserCheck className="h-10 w-10 text-cyan-400 mb-1" />
                      <span className="text-xs font-semibold text-white">{applicantName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">UIDAI / NSDL Reference</span>
                    </div>
                  </div>
                  <div className="mt-2 text-center text-[10px] font-mono text-emerald-400">
                    Government Profile Match
                  </div>
                </div>
              </div>

              {/* SHA-256 Proof Hash Container */}
              <div className="rounded-lg border border-surface-border bg-midnight-950 p-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] uppercase flex items-center gap-1.5 text-cyan-400">
                    <Hash className="h-3 w-3" /> Applicant Biometric Hash (SHA-256)
                  </span>
                  <span className="text-emerald-400 text-[10px]">Anchored to Ledger</span>
                </div>
                <div className="text-slate-200 font-bold break-all text-[11px] select-all bg-midnight-900 p-2 rounded border border-slate-800">
                  {shaHash}
                </div>
              </div>

              {/* Verification Outcome Notifications */}
              {verificationResult === 'matched' && (
                <div className="p-3.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-200 flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div className="text-xs font-mono">
                    <span className="font-bold text-emerald-300 block">Applicant Biometric Verification Passed ({matchConfidence}%)</span>
                    <span>Applicant live face matches government identity baseline for {applicantName}. Unlocking Document Forensics...</span>
                  </div>
                </div>
              )}

              {verificationResult === 'mismatched' && (
                <div className="p-3.5 rounded-lg border border-red-500/50 bg-red-950/50 text-red-200 flex items-center gap-3 animate-fadeIn">
                  <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
                  <div className="text-xs font-mono">
                    <span className="font-bold text-red-300 block">Applicant Biometric Mismatch ({matchConfidence}%)</span>
                    <span>Live camera capture does not match registered applicant identity. LOAN APPLICATION DECLINED.</span>
                  </div>
                </div>
              )}

              {/* Verification Decision Buttons */}
              {!verificationResult && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleRetake}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Retake Applicant Photo</span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    {/* Simulated mismatch button for test demonstration */}
                    <button
                      onClick={() => handleVerifyMatch(false)}
                      className="rounded-lg border border-red-500/40 bg-red-950/40 hover:bg-red-900/50 px-3 py-2 text-xs font-mono text-red-300 transition-colors"
                      title="Demonstrate loan application decline on applicant biometric mismatch"
                    >
                      Simulate Applicant Mismatch
                    </button>

                    {/* Verified match button */}
                    <button
                      onClick={() => handleVerifyMatch(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-4 py-2 text-xs font-mono font-bold text-midnight-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Confirm Applicant Match (≥85%)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Footer Note */}
        <div className="pt-3 border-t border-surface-border text-center text-[10px] font-mono text-slate-500">
          TrustLedger Visual Verification Security Gate • SHA-256 Frame Binding
        </div>
      </div>
    </div>
  );
}
