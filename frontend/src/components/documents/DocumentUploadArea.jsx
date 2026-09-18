import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

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

    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    const fileName = file.name.toLowerCase();
    const isValidExt = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidExt) {
      setUploadError('Invalid file type. Supported formats: PDF, PNG, JPG/JPEG.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10 MB limit.');
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
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-6 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-border mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Upload Evidence
          </h2>
          <p className="text-xs text-slate-400">
            Submit bank statements, GST filings, or ID proofs for AI forensic analysis
          </p>
        </div>

        {/* Document Type Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Type:</span>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="rounded-lg border border-surface-border bg-midnight-950 px-2.5 py-1 text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="Bank Statement">Bank Statement</option>
            <option value="GST Filing">GST Filing (GSTR-3B)</option>
            <option value="Identity Document">Identity Document (PAN/Aadhaar)</option>
            <option value="Salary Slip">Salary Payslip</option>
          </select>
        </div>
      </div>

      {uploadError && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg border border-red-500/40 bg-red-950/40 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Drag & Drop Container */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/30'
            : 'border-surface-border bg-midnight-950/60 hover:border-slate-600 hover:bg-midnight-950'
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
          <div className="h-12 w-12 rounded-full bg-midnight-900 border border-surface-border flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <UploadCloud className="h-6 w-6" />
          </div>

          <div>
            <span className="text-xs sm:text-sm font-semibold text-white block">
              {selectedFile ? selectedFile.name : 'Drop a PDF or image here, or browse files.'}
            </span>
            <span className="text-[11px] font-mono text-slate-400 block mt-1">
              Supported: PDF, PNG, JPG • Maximum: 10 MB
            </span>
          </div>

          {!selectedFile && (
            <button
              type="button"
              className="mt-2 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-950/70 px-4 py-1.5 text-xs font-mono font-medium text-cyan-300 transition-colors"
            >
              Upload Document
            </button>
          )}
        </div>
      </div>

      {/* Upload Progress Bar */}
      {uploading && (
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Uploading & validating checksum...</span>
            <span className="text-cyan-300">{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-midnight-950 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Success & Analyze Trigger */}
      {uploadSuccess && (
        <div className="mt-4 p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div className="text-xs font-mono">
              <span className="font-semibold text-emerald-300 block">
                Document uploaded successfully.
              </span>
              <span className="text-slate-400 text-[11px]">
                {selectedFile?.name} ({((selectedFile?.size || 0) / 1024).toFixed(1)} KB) ready for optical analysis
              </span>
            </div>
          </div>

          <button
            onClick={() => onAnalyzeTrigger && onAnalyzeTrigger(selectedFile, documentType)}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all disabled:opacity-60"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing Document...</span>
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
