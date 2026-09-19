/**
 * TrustLedger LoanDocumentUploader Component
 * Manages loan-specific supporting documents:
 * - Pre-links Phase 1 verified Aadhaar document without duplication
 * - Uploads and validates Address Proof, Income Proof, Bank Statements, DGCA Drone Registration, Drone Insurance
 * - Displays accepted documents, formats, 10MB limit, and strict rejection notice
 * - Provides preview modal and replacement controls in White & Coffee Brown theme
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
  Lock,
  AlertTriangle
} from 'lucide-react';
import DocumentQualityStatus from './DocumentQualityStatus';

export default function LoanDocumentUploader({
  requiredDocuments = [],
  uploadedDocuments = [],
  onUploadDocument,
  onRemoveDocument,
  isProcessing = false,
  errorMessage = '',
  onClearError
}) {
  const [activeUploadType, setActiveUploadType] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleTriggerUpload = (docType) => {
    setActiveUploadType(docType);
    setUploadError('');
    if (onClearError) onClearError();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadType) return;

    const fileName = file.name.toLowerCase();

    // Check for disallowed extensions
    const disallowedExts = ['.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.zip', '.rar', '.exe', '.bat'];
    if (disallowedExts.some(ext => fileName.endsWith(ext))) {
      setUploadError('Presentation, spreadsheet, and archive files (.ppt, .pptx, .doc, .zip) are strictly not accepted. Please upload an authentic PDF or image (JPG, PNG).');
      return;
    }

    // Allowed types check
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));

    if (!allowed.includes(file.type) && !hasValidExt) {
      setUploadError('This document format is not supported. Please upload a PDF, JPG, or PNG file.');
      return;
    }

    // Size check (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10 MB limit. Please compress or upload a smaller file.');
      return;
    }

    try {
      if (onUploadDocument) {
        await onUploadDocument(activeUploadType, file);
      }
    } catch (err) {
      setUploadError(err.message || 'Upload rejected. Document did not pass validation standards.');
    } finally {
      setActiveUploadType(null);
    }
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

      {/* Acceptance Policy & Limits Header Card */}
      <div className="rounded-2xl border border-coffee-200 bg-white p-5 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-coffee-950">Document Submission Standards</h4>
            <p className="text-xs text-coffee-600">Please provide clear, unmodified documents for automated verification.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded-lg bg-coffee-50 border border-coffee-200 text-coffee-800 font-medium">
              Accepted: KYC, Statements, Drone UIN
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-coffee-50 border border-coffee-200 text-coffee-800 font-medium">
              Formats: PDF, JPG, PNG
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-coffee-50 border border-coffee-200 text-coffee-800 font-medium">
              Max Size: 10 MB
            </span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/80 flex items-center gap-2 text-xs text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
          <span className="font-medium">
            <strong>Strict Rejection:</strong> PPT, PPTX, DOC, XLS, ZIP and unrelated documents are strictly rejected.
          </span>
        </div>
      </div>

      {/* Global upload error banner */}
      {(uploadError || errorMessage) && (
        <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-900 flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-rose-950">File rejected</span>
            <p className="mt-0.5 text-rose-800">{uploadError || errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setUploadError('');
              if (onClearError) onClearError();
            }}
            className="text-rose-600 hover:text-rose-900 p-0.5 cursor-pointer"
          >
            <X className="h-4 w-4" />
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
              className={`rounded-2xl border p-5 transition-all ${
                uploaded
                  ? 'border-coffee-200 bg-white shadow-card'
                  : 'border-coffee-200/80 bg-white hover:border-coffee-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                {/* Left: Document Info */}
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    uploaded
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-coffee-50 border-coffee-200 text-coffee-700'
                  }`}>
                    {uploaded ? <FileCheck className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-coffee-950">
                        {req.type}
                      </h4>
                      {req.required && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Required
                        </span>
                      )}
                      {isPreVerified && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Pre-Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-coffee-600 mt-0.5">
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
                        className="px-3.5 py-1.5 rounded-xl border border-coffee-200 bg-white hover:bg-coffee-50 text-xs font-medium text-coffee-800 hover:text-coffee-950 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </button>

                      {!isPreVerified && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleTriggerUpload(req.type)}
                            className="p-2 rounded-xl border border-coffee-200 bg-white hover:bg-coffee-50 text-coffee-700 hover:text-coffee-950 transition-colors shadow-sm cursor-pointer"
                            title="Replace document"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onRemoveDocument && onRemoveDocument(uploaded.document_id)}
                            className="p-2 rounded-xl border border-coffee-200 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-900 transition-colors shadow-sm cursor-pointer"
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
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 text-xs font-bold text-white transition-all shadow-sm cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Document</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quality Status Strip if uploaded */}
              {uploaded && (
                <div className="mt-3 pt-3 border-t border-coffee-100">
                  <DocumentQualityStatus
                    qualityStatus={uploaded.quality_status}
                    qualityMessage={uploaded.quality_message}
                    heuristicMatch={uploaded.heuristic_type_match}
                    heuristicMessage={uploaded.heuristic_message}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-coffee-100 mb-4">
              <div>
                <h4 className="text-sm font-bold text-coffee-950">{previewDoc.document_type}</h4>
                <p className="text-xs text-coffee-600">{previewDoc.filename}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-coffee-600 hover:text-coffee-950 hover:bg-coffee-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center bg-coffee-50/50 rounded-xl p-4 min-h-[250px]">
              {previewDoc.filename?.endsWith('.pdf') ? (
                <div className="text-center p-6">
                  <FileText className="h-16 w-16 text-coffee-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-coffee-950">{previewDoc.filename}</p>
                  <p className="text-xs text-coffee-600 mt-1">Multi-page PDF attached and validated for optical cross-comparison.</p>
                </div>
              ) : (
                <div className="text-center p-6">
                  <FileCheck className="h-16 w-16 text-emerald-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-coffee-950">{previewDoc.filename}</p>
                  <p className="text-xs text-coffee-600 mt-1">Image document attached ({previewDoc.file_type || 'IMG'}).</p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-coffee-100 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
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
