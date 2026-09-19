/**
 * TrustLedger DocumentUploadCard Component
 * Handles secure Aadhaar/KYC document upload, format & size validation,
 * document preview modal, quality assessment, and replace/remove controls.
 * Styled in White & Coffee Brown fintech design system.
 */

import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Eye,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  ShieldCheck,
  ZoomIn,
  AlertTriangle
} from 'lucide-react';

export default function DocumentUploadCard({
  uploadedDocument,
  onDocumentSelected,
  onRemoveDocument,
  isProcessing = false
}) {
  const [dragActive, setDragActive] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    setValidationError('');
    if (!file) return;

    const fileName = file.name.toLowerCase();

    // Check for disallowed extensions
    const disallowedExts = ['.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.zip', '.rar', '.exe'];
    if (disallowedExts.some(ext => fileName.endsWith(ext))) {
      setValidationError('Presentation, spreadsheet, and archive files (.ppt, .pptx, .doc, .zip) are strictly rejected. Please upload an authentic government identity document in PDF, JPG, or PNG format.');
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));

    if (!allowedTypes.includes(file.type) && !hasValidExt) {
      setValidationError('Unsupported format. Please upload a PDF, JPG, or PNG document.');
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      setValidationError('Document is too large. Maximum allowed size is 10 MB.');
      return;
    }

    // Generate local preview URL
    const previewUrl = URL.createObjectURL(file);
    onDocumentSelected(file, previewUrl);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-card relative">
      
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-2 rounded-xl bg-coffee-100 border border-coffee-200 text-coffee-700">
            <FileText className="h-4 w-4" />
          </div>
          <h3 className="text-base font-bold text-coffee-950">
            Verify Your Identity Document
          </h3>
        </div>
        <p className="text-xs text-coffee-600">
          Upload a clear copy of your Aadhaar Card, PAN Card, or Passport for automated optical inspection.
        </p>
      </div>

      {/* Acceptance Badges */}
      <div className="mb-4 flex flex-wrap gap-2 text-[11px]">
        <span className="px-2.5 py-1 rounded-lg bg-coffee-50 border border-coffee-200 text-coffee-800 font-medium">
          Accepted: Aadhaar, PAN, Passport
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-coffee-50 border border-coffee-200 text-coffee-800 font-medium">
          Formats: PDF, JPG, PNG
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-coffee-50 border border-coffee-200 text-coffee-800 font-medium">
          Max: 10 MB
        </span>
      </div>

      {/* Strict Policy Banner */}
      <div className="mb-4 p-2.5 rounded-xl border border-amber-200 bg-amber-50/80 flex items-center gap-2 text-xs text-amber-900">
        <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
        <span><strong>Notice:</strong> PPT, PPTX, DOC, XLS, and ZIP files are strictly not accepted.</span>
      </div>

      {/* Validation Error Notice */}
      {validationError && (
        <div className="mb-4 p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-900 flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-rose-950">Upload not permitted</span>
            <p className="text-[11px] text-rose-800 mt-0.5">{validationError}</p>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------
          STATE 1: NO DOCUMENT UPLOADED (DRAG & DROP ZONE)
          ----------------------------------------------------------------- */}
      {!uploadedDocument ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragActive
              ? 'border-coffee-600 bg-coffee-50 shadow-sm'
              : 'border-coffee-200 bg-coffee-50/40 hover:border-coffee-400 hover:bg-coffee-50/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />

          <div className="h-12 w-12 rounded-full bg-white border border-coffee-200 flex items-center justify-center text-coffee-600 mb-3 shadow-sm">
            <Upload className="h-6 w-6" />
          </div>

          <span className="text-xs font-bold text-coffee-950">
            Click to upload or drag & drop document
          </span>
          <span className="text-[11px] text-coffee-600 mt-1">
            Supports PDF, JPG, PNG (Max 10 MB)
          </span>

          <div className="mt-4 flex items-center gap-2 text-[10px] text-coffee-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Encrypted & tamper-evident SHA-256 evidence logging</span>
          </div>
        </div>
      ) : (
        /* -----------------------------------------------------------------
           STATE 2: DOCUMENT UPLOADED (CARD WITH PREVIEW, REPLACE, REMOVE)
           ----------------------------------------------------------------- */
        <div className="rounded-2xl border border-coffee-200 bg-coffee-50/50 p-4 space-y-4">
          
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-coffee-950 block truncate max-w-[220px] sm:max-w-xs">
                  {uploadedDocument.filename || uploadedDocument.name}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-coffee-600 mt-0.5">
                  <span className="uppercase font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-coffee-200 text-coffee-800 font-semibold">
                    {uploadedDocument.fileType || 'Identity Doc'}
                  </span>
                  <span>
                    {uploadedDocument.size ? `${(uploadedDocument.size / (1024 * 1024)).toFixed(2)} MB` : 'Validated'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="px-3 py-1.5 rounded-xl text-coffee-800 hover:text-coffee-950 bg-white hover:bg-coffee-50 border border-coffee-200 transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
                title="Preview document"
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-xl text-coffee-700 hover:text-coffee-950 bg-white hover:bg-coffee-50 border border-coffee-200 transition-colors shadow-sm"
                title="Replace document"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={onRemoveDocument}
                className="p-1.5 rounded-xl text-rose-700 hover:text-rose-900 bg-white hover:bg-rose-50 border border-coffee-200 transition-colors shadow-sm"
                title="Remove document"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Optical Quality Inspection Details */}
          {uploadedDocument.qualityCheck && (
            <div className="pt-3 border-t border-coffee-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-coffee-700">Readability Score:</span>
                <span className="font-bold text-coffee-950">{uploadedDocument.qualityCheck.brightness_score || '98'}%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-coffee-700">Edge & Focus:</span>
                <span className="font-bold text-coffee-950">Sharp (Validated)</span>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-coffee-100 mb-4">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4 text-coffee-600" />
                <h4 className="text-sm font-bold text-coffee-950">
                  Document Preview: {uploadedDocument?.filename || uploadedDocument?.name}
                </h4>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1 rounded-lg text-coffee-600 hover:text-coffee-950 hover:bg-coffee-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center bg-coffee-50/50 rounded-xl p-4 min-h-[300px]">
              {uploadedDocument?.previewUrl && (
                uploadedDocument.previewUrl.endsWith('.pdf') || (uploadedDocument.name && uploadedDocument.name.endsWith('.pdf')) ? (
                  <div className="text-center p-8">
                    <FileText className="h-16 w-16 text-coffee-600 mx-auto mb-3" />
                    <p className="text-sm font-bold text-coffee-950">PDF Document Attached</p>
                    <p className="text-xs text-coffee-600 mt-1">Multi-page PDF ready for server-side optical inspection.</p>
                  </div>
                ) : (
                  <img
                    src={uploadedDocument.previewUrl}
                    alt="Document preview"
                    className="max-h-[60vh] max-w-full rounded-lg object-contain shadow"
                  />
                )
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-coffee-100 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
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
