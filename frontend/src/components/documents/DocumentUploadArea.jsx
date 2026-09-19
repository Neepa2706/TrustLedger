import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function DocumentUploadArea({
  onUploadComplete,
  onAnalyzeTrigger,
  isAnalyzing = false
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [documentType, setDocumentType] = useState('Bank Statement');

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (file) => {
    setUploadError('');
    setUploadSuccess(false);

    if (!file) return;

    const fileName = file.name.toLowerCase();

    // Check for strictly rejected formats
    const disallowedExts = ['.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.zip', '.rar', '.exe', '.bat'];
    if (disallowedExts.some(ext => fileName.endsWith(ext))) {
      setUploadError('Presentation, spreadsheet, and archive files (.ppt, .pptx, .doc, .zip) are strictly not accepted. Please upload an authentic PDF or image.');
      return;
    }

    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    const isValidExt = validExtensions.some(ext => fileName.endsWith(ext));
    if (!isValidExt) {
      setUploadError('Invalid file type. Supported formats: PDF, PNG, JPG, JPEG only.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10 MB limit. Please compress or upload a smaller file.');
      return;
    }

    setSelectedFile(file);
    startSimulatedUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const startSimulatedUpload = (file) => {
    setUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setUploading(false);
          setUploadSuccess(true);
          if (onUploadComplete) {
            onUploadComplete({ file, documentType });
          }
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-coffee-100 mb-4">
        <div>
          <h2 className="text-sm font-bold text-coffee-950 tracking-wide">
            Upload Evidence Document
          </h2>
          <p className="text-xs text-coffee-600">
            Submit bank statements, KYC identities, or drone documentation for cryptographic forensic inspection
          </p>
        </div>

        {/* Document Type Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-coffee-600 font-medium">Type:</span>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="rounded-xl border border-coffee-200 bg-coffee-50 px-3 py-1.5 text-xs font-medium text-coffee-950 focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500 shadow-sm"
          >
            <option value="Bank Statement">Bank Statement</option>
            <option value="Identity Document">Identity Document (Aadhaar/PAN/Passport)</option>
            <option value="DGCA Drone Registration / UIN">DGCA Drone Registration / UIN</option>
            <option value="Drone Insurance">Drone Insurance Policy</option>
            <option value="Salary Slip">Salary Payslip</option>
            <option value="GST Filing">GST Certificate / MSME</option>
          </select>
        </div>
      </div>

      {/* Acceptance Policy Bar */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-coffee-50 border border-coffee-200/80 flex items-center gap-2 text-coffee-900">
          <FileText className="h-4 w-4 text-coffee-600 shrink-0" />
          <span className="truncate"><strong>Accepted:</strong> KYC, Bank, Drone</span>
        </div>
        <div className="p-2.5 rounded-xl bg-coffee-50 border border-coffee-200/80 flex items-center gap-2 text-coffee-900">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span><strong>Formats:</strong> PDF, JPG, PNG</span>
        </div>
        <div className="p-2.5 rounded-xl bg-coffee-50 border border-coffee-200/80 flex items-center gap-2 text-coffee-900">
          <span className="h-2 w-2 rounded-full bg-coffee-600 shrink-0"></span>
          <span><strong>Max Size:</strong> 10 MB per file</span>
        </div>
      </div>

      {/* Strict Warning Banner */}
      <div className="mb-4 p-3 rounded-xl border border-amber-200 bg-amber-50/80 flex items-center gap-2.5 text-xs text-amber-900">
        <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
        <span className="font-medium">
          <strong>Strict Policy:</strong> PPT, PPTX, DOC, XLS, ZIP and unrelated files are strictly rejected.
        </span>
      </div>

      {uploadError && (
        <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-900 animate-fadeIn">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-rose-950">File rejected</span>
            <p className="mt-0.5 text-rose-800">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Drag & Drop Container */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? 'border-coffee-600 bg-coffee-50/70 shadow-sm'
            : 'border-coffee-200 bg-coffee-50/30 hover:border-coffee-400 hover:bg-coffee-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-white border border-coffee-200 flex items-center justify-center text-coffee-600 shadow-sm group-hover:scale-105 transition-transform">
            <UploadCloud className="h-6 w-6" />
          </div>

          <div>
            <span className="text-xs sm:text-sm font-bold text-coffee-950 block">
              {selectedFile ? selectedFile.name : 'Drop a PDF or image here, or click to browse'}
            </span>
            <span className="text-[11px] text-coffee-600 block mt-1">
              Supported: PDF, PNG, JPG • Maximum: 10 MB
            </span>
          </div>

          {!selectedFile && (
            <button
              type="button"
              className="mt-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              Choose Document
            </button>
          )}
        </div>
      </div>

      {/* Upload Progress Bar */}
      {uploading && (
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-coffee-700">
            <span>Uploading & verifying checksum...</span>
            <span className="font-bold text-coffee-900">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-coffee-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-coffee-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Success & Analyze Trigger */}
      {uploadSuccess && (
        <div className="mt-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-950 block">
                Document accepted & uploaded successfully.
              </span>
              <span className="text-emerald-800 text-[11px]">
                {selectedFile?.name} ({((selectedFile?.size || 0) / 1024).toFixed(1)} KB) passed format verification
              </span>
            </div>
          </div>

          <button
            onClick={() => onAnalyzeTrigger && onAnalyzeTrigger(selectedFile, documentType)}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-5 py-2 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-60 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running Forensic Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze Document</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
