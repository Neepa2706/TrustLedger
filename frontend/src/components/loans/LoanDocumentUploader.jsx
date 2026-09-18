/**
 * TrustLedger LoanDocumentUploader Component
 * Manages loan-specific supporting documents:
 * - Pre-links Phase 1 verified Aadhaar document without duplication
 * - Uploads and validates Address Proof, Income Proof, Bank Statements
 * - Runs optical quality and document-type consistency checks
 * - Provides preview modal and replacement controls
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Eye,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  ShieldCheck,
  Lock
} from 'lucide-react';
import DocumentQualityStatus from './DocumentQualityStatus';

export default function LoanDocumentUploader({
  requiredDocuments = [],
  uploadedDocuments = [],
  onUploadDocument,
  onRemoveDocument,
  isProcessing = false
}) {
  const [activeUploadType, setActiveUploadType] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleTriggerUpload = (docType) => {
    setActiveUploadType(docType);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadType) return;

    // Allowed types check
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      setUploadError('This document format is not supported. Please upload a PDF, JPG, or PNG file.');
      return;
    }

    // Size check
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10 MB limit. Please upload a smaller file.');
      return;
    }

    onUploadDocument(activeUploadType, file);
    setActiveUploadType(null);
  };

  // Map uploaded documents by type
  const docMap = {};
  uploadedDocuments.forEach((d) => {
    docMap[d.document_type] = d;
  });

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Global upload error banner */}
      {uploadError && (
        <div className="p-3 rounded-xl border border-red-500/40 bg-red-950/40 text-xs text-red-200 flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">{uploadError}</div>
          <button onClick={() => setUploadError('')} className="text-red-400 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Required Documents List */}
      <div className="space-y-3.5">
        {requiredDocuments.map((req) => {
          const uploaded = docMap[req.type];
          const isPreVerified = uploaded?.is_pre_verified;

          return (
            <div
              key={req.type}
              className={`rounded-xl border p-4 transition-all ${
                uploaded
                  ? 'border-surface-border bg-midnight-950'
                  : 'border-surface-border/80 bg-surface-card/60 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                {/* Left: Document Info */}
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    uploaded
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                      : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400'
                  }`}>
                    {uploaded ? <FileCheck className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">
                        {req.type}
                      </h4>
                      {req.required && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-midnight-900 border border-surface-border text-amber-300">
                          Required
                        </span>
                      )}
                      {isPreVerified && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                          Pre-Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {req.note || 'Required supporting documentation'}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {uploaded ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(uploaded)}
                        className="px-3 py-1.5 rounded-lg border border-surface-border bg-midnight-900 hover:bg-midnight-850 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </button>

                      {!isPreVerified && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleTriggerUpload(req.type)}
                            className="p-1.5 rounded-lg border border-surface-border bg-midnight-900 hover:bg-midnight-850 text-slate-300 hover:text-white transition-colors"
                            title="Replace document"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onRemoveDocument && onRemoveDocument(uploaded.document_id)}
                            className="p-1.5 rounded-lg border border-surface-border bg-midnight-900 hover:bg-red-950/40 text-slate-400 hover:text-red-300 transition-colors"
                            title="Remove document"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleTriggerUpload(req.type)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-400 text-xs font-semibold text-cyan-300 transition-all shadow-sm"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload File</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quality Status Strip if uploaded */}
              {uploaded && (
                <div className="mt-3 pt-2.5 border-t border-surface-border/60">
                  <DocumentQualityStatus
                    qualityStatus={uploaded.quality_status}
                    qualityMessage={uploaded.quality_message}
                    heuristicMatch={uploaded.heuristic_type_match}
                    heuristicMessage={uploaded.heuristic_message}
                    isPreVerified={uploaded.is_pre_verified}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl border border-surface-border bg-surface-card p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  {previewDoc.document_type}: {previewDoc.filename}
                </h4>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-xl bg-midnight-950 p-6 flex flex-col items-center justify-center min-h-[280px] text-center space-y-3">
              <FileCheck className="h-16 w-16 text-cyan-400 mx-auto" />
              <div>
                <h5 className="text-sm font-semibold text-white">{previewDoc.filename}</h5>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Format: {previewDoc.file_type} • Size: {(previewDoc.file_size_bytes / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              <div className="p-3 rounded-lg bg-midnight-900 border border-surface-border max-w-md text-xs text-slate-300">
                <span className="font-semibold text-cyan-300 block mb-0.5">Underwriting Status</span>
                <span>{previewDoc.quality_message}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-midnight-900 hover:bg-midnight-850 text-xs font-semibold text-slate-200 border border-surface-border"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
