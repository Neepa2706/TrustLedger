-- =============================================================================
-- TRUSTLEDGER USER APP - PHASE 3 VERIFICATION & AUDIT SCHEMA
-- =============================================================================
-- Product Rule: ONE PERSON = ONE USER ACCOUNT
-- User Data Isolation: Borrowers can strictly view and edit only their own verification records
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. APPLICATION KYC VERIFICATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.application_kyc_verifications (
    verification_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Verification States
    overall_status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (
        overall_status IN ('READY_FOR_SUBMISSION', 'REVIEW_REQUIRED', 'BLOCKED', 'IN_PROGRESS')
    ),
    
    -- Sub-checks (Boolean & Status)
    profile_details_verified BOOLEAN DEFAULT FALSE,
    identity_document_available BOOLEAN DEFAULT FALSE,
    profile_photo_captured BOOLEAN DEFAULT FALSE,
    
    -- Face & Image Quality checks
    face_detected BOOLEAN DEFAULT FALSE,
    single_face_detected BOOLEAN DEFAULT FALSE,
    face_quality_score NUMERIC(5, 2),
    face_quality_status VARCHAR(20) DEFAULT 'GOOD' CHECK (face_quality_status IN ('GOOD', 'WARNING', 'ERROR')),
    face_check_label VARCHAR(100) DEFAULT 'Face / KYC quality check',
    
    -- Document Readiness
    required_documents_present BOOLEAN DEFAULT FALSE,
    documents_quality_status VARCHAR(20) DEFAULT 'GOOD' CHECK (documents_quality_status IN ('GOOD', 'WARNING', 'ERROR')),
    
    -- Heuristic Details
    is_heuristic BOOLEAN DEFAULT TRUE,
    check_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    advisories JSONB NOT NULL DEFAULT '[]'::jsonb,
    blocking_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kyc_verif_app_id ON public.application_kyc_verifications(application_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verif_user_id ON public.application_kyc_verifications(user_id);

-- -----------------------------------------------------------------------------
-- 2. DOCUMENT CROSS-COMPARISONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.document_cross_comparisons (
    comparison_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    registered_document_ref VARCHAR(100),
    application_document_id VARCHAR(50) REFERENCES public.loan_application_documents(document_id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    
    -- Comparison Verdict
    comparison_status VARCHAR(20) NOT NULL DEFAULT 'MATCH' CHECK (
        comparison_status IN ('MATCH', 'REVIEW', 'MISMATCH', 'NOT_CHECKED')
    ),
    heuristic_confidence NUMERIC(4, 2) DEFAULT 0.90,
    is_heuristic BOOLEAN DEFAULT TRUE,
    
    -- Compared Attributes (Non-sensitive tokens only)
    matched_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    review_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    mismatched_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    user_message TEXT NOT NULL,
    internal_notes TEXT,
    
    compared_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doc_comp_app_id ON public.document_cross_comparisons(application_id);
CREATE INDEX IF NOT EXISTS idx_doc_comp_user_id ON public.document_cross_comparisons(user_id);

-- -----------------------------------------------------------------------------
-- 3. APPLICATION AUDIT EVENTS TABLE (Tamper-evident log with SHA-256)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.application_audit_events (
    event_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    event_type VARCHAR(50) NOT NULL CHECK (
        event_type IN (
            'APPLICATION_CREATED',
            'DOCUMENT_UPLOADED',
            'DOCUMENT_QUALITY_CHECKED',
            'KYC_CHECKED',
            'DOCUMENT_COMPARISON_PERFORMED',
            'APPLICATION_SUBMITTED',
            'STATUS_UPDATED'
        )
    ),
    event_summary TEXT NOT NULL,
    event_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Tamper-evident integrity fields
    previous_event_hash VARCHAR(64),
    event_hash VARCHAR(64) NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_app_id ON public.application_audit_events(application_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON public.application_audit_events(user_id);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.application_kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_cross_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_audit_events ENABLE ROW LEVEL SECURITY;

-- 1. application_kyc_verifications
CREATE POLICY "Users can only view their own kyc verifications"
    ON public.application_kyc_verifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own kyc verifications"
    ON public.application_kyc_verifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own kyc verifications"
    ON public.application_kyc_verifications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. document_cross_comparisons
CREATE POLICY "Users can only view their own document comparisons"
    ON public.document_cross_comparisons FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own document comparisons"
    ON public.document_cross_comparisons FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 3. application_audit_events
CREATE POLICY "Users can only view their own application audit events"
    ON public.application_audit_events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own application audit events"
    ON public.application_audit_events FOR INSERT
    WITH CHECK (auth.uid() = user_id);
