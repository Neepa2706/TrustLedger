import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  Camera,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  Hash,
  X,
  FileSpreadsheet
} from 'lucide-react';
import VisualVerificationModal from '../components/documents/VisualVerificationModal';
import DocumentUploadArea from '../components/documents/DocumentUploadArea';
import DocumentPreviewCanvas from '../components/documents/DocumentPreviewCanvas';
import ForensicFindingsList from '../components/documents/ForensicFindingsList';
import DocumentMetadataPanel from '../components/documents/DocumentMetadataPanel';
import OcrComparisonPanel from '../components/documents/OcrComparisonPanel';
import VisualAnalysisPanel from '../components/documents/VisualAnalysisPanel';
import RiskScoreRing from '../components/ui/RiskScoreRing';
import StatusBadge from '../components/ui/StatusBadge';
import { applicationsList } from '../data/applicationsData';

export default function DocumentsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const initialAppId = searchParams.get('app') || 'APP-1003';
  const initialDoc = searchParams.get('doc') || 'bank_statement';
  const initialVerify = searchParams.get('verify') === 'true' || searchParams.get('verify') === 'open';

  const [selectedAppId, setSelectedAppId] = useState(initialAppId);
  const [selectedApp, setSelectedApp] = useState(() => {
    return applicationsList.find(a => a.id === initialAppId) || applicationsList[2];
  });

  // Visual Verification Gate State
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(initialVerify);
  const [verifiedStateByApp, setVerifiedStateByApp] = useState({
    'APP-1001': { verified: true, hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', confidence: 99.8 },
    'APP-1003': { verified: false, hash: null, confidence: null } // requires camera check!
  });
  const [declinedApplications, setDeclinedApplications] = useState([]);

  // Active Document State
  const [activeDocType, setActiveDocType] = useState(initialDoc);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Synchronize app selection and URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const appParam = params.get('app');
    const docParam = params.get('doc');
    const verifyParam = params.get('verify');
    if (appParam && appParam !== selectedAppId) {
      setSelectedAppId(appParam);
      const found = applicationsList.find(a => a.id === appParam);
      if (found) setSelectedApp(found);
    }
    if (docParam && docParam !== activeDocType) {
      setActiveDocType(docParam);
    }
    if (verifyParam === 'true' || verifyParam === 'open') {
      setIsVerificationModalOpen(true);
    }
  }, [location.search]);

  useEffect(() => {
    const found = applicationsList.find(a => a.id === selectedAppId);
    if (found) {
      setSelectedApp(found);
    }
  }, [selectedAppId]);

  const currentVerification = verifiedStateByApp[selectedAppId] || { verified: false };
  const isDeclined = declinedApplications.includes(selectedAppId);

  // Mock Document Forensic Payload for APP-1003 vs other apps
  const currentDocPayload = {
    document_id: selectedAppId === 'APP-1003' ? 'DOC-1003-01' : `DOC-${selectedAppId}-01`,
    application_id: selectedAppId,
    filename: activeDocType === 'bank_statement'
      ? `Bank_Statement_${selectedApp?.applicant?.replace(' ', '')}_May2026.pdf`
      : `GSTR3B_Filing_${selectedApp?.applicant?.replace(' ', '')}.pdf`,
    document_type: activeDocType === 'bank_statement' ? 'Bank Statement' : 'GST Filing',
    risk_score: selectedAppId === 'APP-1003' ? (activeDocType === 'bank_statement' ? 87 : 72) : 12,
    risk_level: selectedAppId === 'APP-1003' ? 'HIGH' : 'LOW',
    findings: selectedAppId === 'APP-1003' ? [
      {
        id: 'f-1',
        type: 'formatting',
        severity: 'high',
        title: 'Font inconsistency detected in salary deposit row',
        description: "Text region '₹95,000.00' uses Helvetica-Bold font subset differing from baseline statement font.",
        location: 'Page 2: Line 14',
        bbox: { x: 140, y: 310, width: 320, height: 38, page: 2 }
      },
      {
        id: 'f-2',
        type: 'metadata',
        severity: 'medium',
        title: 'Metadata modification signal',
        description: 'Document was modified 14 days after original export timestamp with Adobe Photoshop 24.1.',
        location: 'Header / XMP',
        bbox: null
      },
      {
        id: 'f-3',
        type: 'ocr_mismatch',
        severity: 'high',
        title: 'OCR / text mismatch detected',
        description: "Visual character scan reads '₹95,000' while underlying stream contains residue token '₹25,000'.",
        location: 'Page 2: Net Deposit',
        bbox: { x: 140, y: 310, width: 320, height: 38, page: 2 }
      }
    ] : [],
    metadata: {
      page_count: 3,
      title: 'Digital Statement - May 2026',
      author: 'National Retail Bank',
      creator: 'CoreBanking Export v4.2',
      producer: selectedAppId === 'APP-1003' ? 'Adobe Photoshop 24.1 (Windows)' : 'PDFlib+PDI 9.2',
      creation_date: '2026-05-02 08:30:11 UTC',
      modification_date: selectedAppId === 'APP-1003' ? '2026-05-16 14:12:45 UTC' : '2026-05-02 08:30:11 UTC',
      fonts: ['ArialMT', 'Helvetica-Bold', 'Times-Roman', 'Courier'],
      image_count: 2,
      file_size_bytes: 482100,
      file_size_formatted: '470.8 KB',
      page_dimensions: '595 x 842 pt'
    },
    ocr: {
      available: true,
      text: `STATE BANK OF INDIA - STATEMENT OF ACCOUNT\nName: ${selectedApp?.applicant}\nNet Monthly Credit: ₹95,000.00\nClosing Balance: ₹1,48,200.00`,
      confidence: 91.4,
      engine: 'Tesseract OCR',
      character_count: 420,
      reason: null
    },
    visual_signals: {
      image_regions_analyzed: 4,
      suspicious_regions: selectedAppId === 'APP-1003' ? 1 : 0,
      layout_consistency: selectedAppId === 'APP-1003' ? 68 : 98,
      font_consistency: selectedAppId === 'APP-1003' ? 42 : 99,
      ocr_consistency: selectedAppId === 'APP-1003' ? 55 : 98
    },
    text_analysis: {
      total_characters: 3840,
      total_blocks: 24,
      extracted_text_preview: `STATE BANK OF INDIA - STATEMENT OF ACCOUNT\nCustomer: ${selectedApp?.applicant}\nAccount: •••••••• 4821\nBranch: Gurugram Sector-14\n02 May: SALARY CREDIT CORP: ₹95,000.00\nClosing Balance: ₹1,48,200.00`,
      currency_tokens_detected: ['₹95,000.00', '₹1,48,200.00', '₹12,400.00', '₹4,250.00'],
      sensitive_entities_masked: true
    },
    recommended_action: selectedAppId === 'APP-1003'
      ? 'Review the original source document before making a lending decision. Cross-check net monthly salary.'
      : 'No significant anomalies detected. Standard automated underwriting may proceed.'
  };

  const handleVerificationSuccess = (data) => {
    setVerifiedStateByApp(prev => ({
      ...prev,
      [selectedAppId]: { verified: true, hash: data.hash, confidence: data.confidence }
    }));
    setIsVerificationModalOpen(false);
    setToastMessage(`Applicant Biometric Verification Confirmed for ${selectedApp?.applicant || 'Applicant'}. Directing to Loan Application Details...`);
    setTimeout(() => {
      navigate(`/applications/${selectedAppId || 'APP-1003'}`);
    }, 1200);
  };

  const handleVerificationFailed = (data) => {
    setIsVerificationModalOpen(false);
    setDeclinedApplications(prev => [...prev, selectedAppId]);
    setToastMessage(`Applicant Biometric Mismatch (${data.confidence}%). Loan Application Declined.`);
    setTimeout(() => setToastMessage(''), 5000);
  };

  const handleAnalyzeTrigger = (file, docType) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setToastMessage('AI forensic analysis complete. Findings updated.');
      setTimeout(() => setToastMessage(''), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-coffee-200 bg-white px-4 py-3 text-xs font-mono text-espresso shadow-2xl animate-fadeIn">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="text-stone-400 hover:text-espresso"
            aria-label="Dismiss toast"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Visual Verification Modal */}
      <VisualVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        applicantName={selectedApp?.applicant}
        applicationId={selectedAppId}
        onVerificationSuccess={handleVerificationSuccess}
        onVerificationFailed={handleVerificationFailed}
      />

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-coffee-700">
            <span>INTELLIGENCE MODULE</span>
            <span>/</span>
            <span className="text-stone-500">ZERO-TRUST DOCUMENT FORENSICS</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold tracking-tight text-espresso">
              Document Forensics
            </h1>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-warm-100 text-coffee-800 border border-coffee-200 font-semibold tracking-wider">
              AI ANALYSIS ENGINE
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Analyze digital evidence for potential manipulation, structural anomalies, and integrity signals.
          </p>
        </div>

        {/* Application Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-stone-500">Focus Application:</span>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="rounded-xl border border-coffee-200 bg-white px-3 py-1.5 text-espresso font-semibold focus:border-coffee-500 focus:outline-none shadow-xs"
          >
            <option value="APP-1003">APP-1003 — Rahul Verma (₹45,000)</option>
            <option value="APP-1001">APP-1001 — Arjun Mehta (₹15,000)</option>
            <option value="APP-1002">APP-1002 — Priya Sharma (₹28,000)</option>
            <option value="APP-1004">APP-1004 — Ananya Rao (₹60,000)</option>
            <option value="APP-1005">APP-1005 — Vikram Singh (₹32,000)</option>
          </select>
        </div>
      </div>

      {/* STEP 1 GATE: Applicant Visual Biometric Verification Status Bar */}
      {isDeclined ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-rose-800 block font-mono">
                LOAN APPLICATION DECLINED: APPLICANT BIOMETRIC MISMATCH
              </span>
              <span className="text-xs text-rose-900">
                Live webcam capture failed facial identity cross-reference with applicant registered PAN/Aadhaar profile for <strong className="text-espresso font-bold">{selectedApp?.applicant}</strong>. Document processing locked.
              </span>
            </div>
          </div>
          <button
            onClick={() => setDeclinedApplications(prev => prev.filter(id => id !== selectedAppId))}
            className="text-xs font-mono text-coffee-700 hover:text-coffee-900 font-semibold underline shrink-0"
          >
            Reset Applicant Verification
          </button>
        </div>
      ) : !currentVerification.verified ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-900 font-mono">
                  Step 1 Required: Applicant Biometric Face Verification
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-semibold">
                  APPLICANT ONBOARDING GATE
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-0.5">
                The loan applicant (<span className="text-espresso font-bold">{selectedApp?.applicant}</span>) must complete live webcam biometric verification before lending documents are unlocked for forensic underwriting.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-4 py-2 text-xs font-mono font-bold text-white shadow-sm transition-all"
          >
            <Camera className="h-4 w-4" />
            <span>Launch Applicant Camera Verification</span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
            <div>
              <span className="text-emerald-800 font-bold block">
                Applicant Biometric Face Verification Passed ({currentVerification.confidence || 99.8}%)
              </span>
              <span className="text-stone-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                <Hash className="h-3 w-3 text-coffee-600" />
                <span>Applicant SHA-256 Frame Digest: {currentVerification.hash ? `${currentVerification.hash.slice(0, 16)}...${currentVerification.hash.slice(-16)}` : 'e3b0c442...b855'}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate(`/applications/${selectedAppId || 'APP-1003'}`)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-xs font-mono font-bold shadow-xs transition"
            >
              <span>Direct to Loan Application Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => navigate('/applications')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-coffee-200 bg-white hover:bg-coffee-50 text-coffee-800 px-3 py-1.5 text-xs font-mono transition"
            >
              <span>Applications Queue</span>
            </button>
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="text-[11px] text-stone-500 hover:text-espresso font-semibold underline px-2"
            >
              Re-scan
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Document Upload Area */}
      <DocumentUploadArea
        onUploadComplete={() => {}}
        onAnalyzeTrigger={handleAnalyzeTrigger}
        isAnalyzing={isAnalyzing}
      />

      {/* Document List Selection Bar */}
      <div className="rounded-2xl border border-coffee-200 bg-white p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-stone-500">Active Document:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveDocType('bank_statement')}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                activeDocType === 'bank_statement'
                  ? 'bg-coffee-600 text-white border-coffee-600 font-bold shadow-xs'
                  : 'bg-warm-50 text-stone-600 border-coffee-200 hover:bg-white'
              }`}
            >
              Bank Statement ({selectedAppId === 'APP-1003' ? '87% Risk' : '12% Risk'})
            </button>
            <button
              onClick={() => setActiveDocType('gst_filing')}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                activeDocType === 'gst_filing'
                  ? 'bg-coffee-600 text-white border-coffee-600 font-bold shadow-xs'
                  : 'bg-warm-50 text-stone-600 border-coffee-200 hover:bg-white'
              }`}
            >
              GST Return (GSTR-3B)
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate(`/applications/${selectedAppId}`)}
          className="text-xs text-coffee-700 hover:text-coffee-900 font-semibold inline-flex items-center gap-1"
        >
          <span>Return to Application Dossier</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Split-Screen Forensic Canvas: Left Preview, Right Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left: Document Preview Canvas with Clickable Suspicious Region */}
        <div className="xl:col-span-7">
          <DocumentPreviewCanvas
            document={currentDocPayload}
            selectedFinding={selectedFinding}
            onSelectFinding={setSelectedFinding}
          />
        </div>

        {/* Right: Forensic Risk Card & Findings */}
        <div className="xl:col-span-5 space-y-6">
          {/* Forensic Risk Card */}
          <div className="rounded-2xl border border-coffee-200 bg-white p-5 shadow-sm flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between pb-3 border-b border-coffee-100">
              <div>
                <h3 className="text-sm font-semibold text-espresso tracking-wide">
                  DOCUMENT RISK INDEX
                </h3>
                <p className="text-[11px] text-stone-500">
                  AI-assisted forensic assessment
                </p>
              </div>
              <StatusBadge
                status={currentDocPayload.risk_score > 65 ? 'CRITICAL' : 'SAFE'}
                customLabel={currentDocPayload.risk_level}
                size="sm"
              />
            </div>

            <div className="py-4">
              <RiskScoreRing
                score={currentDocPayload.risk_score}
                size={150}
                strokeWidth={12}
                label={`${currentDocPayload.document_type} Forensic Score`}
              />
            </div>

            <p className="text-[10px] font-mono text-stone-500 text-center border-t border-coffee-100 pt-3">
              Score is based on prototype forensic signals and should be reviewed alongside the original evidence.
            </p>
          </div>

          {/* Forensic Findings List */}
          <ForensicFindingsList
            findings={currentDocPayload.findings}
            selectedFinding={selectedFinding}
            onSelectFinding={setSelectedFinding}
          />
        </div>
      </div>

      {/* Metadata & OCR Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <DocumentMetadataPanel
            metadata={currentDocPayload.metadata}
            filename={currentDocPayload.filename}
          />
        </div>
        <div className="lg:col-span-5">
          <OcrComparisonPanel
            textAnalysis={currentDocPayload.textAnalysis}
            ocr={currentDocPayload.ocr}
            isSuspicious={currentDocPayload.risk_score > 65}
          />
        </div>
      </div>

      {/* Visual Signals & Analysis Summary */}
      <VisualAnalysisPanel
        visualSignals={currentDocPayload.visual_signals}
        riskScore={currentDocPayload.risk_score}
        recommendedAction={currentDocPayload.recommended_action}
      />
    </div>
  );
}
