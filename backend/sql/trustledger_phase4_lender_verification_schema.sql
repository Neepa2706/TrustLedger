-- =============================================================================
-- TRUSTLEDGER USER APP - PHASE 4 LENDER VERIFICATION & DECISION SCHEMA
-- =============================================================================
-- Authoritative underwriting records, information requests, and internal notes.
-- Data Isolation: Internal notes & internal review details are restricted to lenders.
-- Borrowers can only read borrower-safe application statuses and action requests.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. LENDER REVIEWS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lender_reviews (
    review_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    reviewer_id VARCHAR(100) NOT NULL,
    reviewer_name VARCHAR(255) NOT NULL DEFAULT 'Underwriting Officer',
    
    -- Review & Decision States
    review_status VARCHAR(30) NOT NULL DEFAULT 'UNDER_REVIEW' CHECK (
        review_status IN ('UNDER_REVIEW', 'ACTION_REQUIRED', 'APPROVED', 'REJECTED')
    ),
    decision VARCHAR(30) CHECK (
        decision IN ('APPROVED', 'REJECTED', 'REQUEST_ACTION')
    ),
    decision_reason TEXT,
    
    -- Approved Terms (Populated only if decision = 'APPROVED')
    approved_amount NUMERIC(12, 2),
    approved_duration_months INTEGER,
    approved_interest_rate NUMERIC(5, 2),
    approved_emi NUMERIC(10, 2),
    
    -- Internal-Only Notes (Strictly hidden from borrowers)
    internal_note TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lender_reviews_app_id ON public.lender_reviews(application_id);
CREATE INDEX IF NOT EXISTS idx_lender_reviews_reviewer ON public.lender_reviews(reviewer_id);

-- -----------------------------------------------------------------------------
-- 2. ACTION REQUESTS TABLE (Lender requests information from Borrower)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.action_requests (
    request_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    requested_by VARCHAR(100) NOT NULL,
    
    request_type VARCHAR(50) NOT NULL DEFAULT 'DOCUMENT_CLARIFICATION' CHECK (
        request_type IN ('DOCUMENT_CLARIFICATION', 'INCOME_PROOF_REUPLOAD', 'BANK_STATEMENT_REUPLOAD', 'GENERAL_INFORMATION')
    ),
    message TEXT NOT NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (
        status IN ('PENDING', 'RESOLVED', 'CANCELLED')
    ),
    
    borrower_response TEXT,
    response_document_id VARCHAR(50),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_action_requests_app_id ON public.action_requests(application_id);
CREATE INDEX IF NOT EXISTS idx_action_requests_status ON public.action_requests(status);

-- -----------------------------------------------------------------------------
-- 3. INVESTIGATOR INTERNAL NOTES TABLE (Strictly Lender-Only)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.investigator_notes (
    note_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    author_id VARCHAR(100) NOT NULL,
    author_name VARCHAR(255) NOT NULL DEFAULT 'Investigator',
    
    note_text TEXT NOT NULL,
    is_internal_only BOOLEAN NOT NULL DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_investigator_notes_app_id ON public.investigator_notes(application_id);

-- -----------------------------------------------------------------------------
-- 4. UPDATE APPLICATION STATUS CONSTRAINT
-- -----------------------------------------------------------------------------
-- Ensure application_status in public.loan_applications allows Phase 4 statuses:
-- DRAFT, READY_FOR_REVIEW, SUBMITTED, UNDER_VERIFICATION, UNDER_REVIEW, ACTION_REQUIRED, APPROVED, REJECTED
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'loan_applications_application_status_check'
    ) THEN
        ALTER TABLE public.loan_applications 
            DROP CONSTRAINT loan_applications_application_status_check;
        ALTER TABLE public.loan_applications
            ADD CONSTRAINT loan_applications_application_status_check CHECK (
                application_status IN (
                    'DRAFT',
                    'READY_FOR_REVIEW',
                    'SUBMITTED',
                    'UNDER_VERIFICATION',
                    'UNDER_REVIEW',
                    'ACTION_REQUIRED',
                    'APPROVED',
                    'REJECTED'
                )
            );
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.lender_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigator_notes ENABLE ROW LEVEL SECURITY;

-- action_requests: Borrowers can read requests related to their own applications
CREATE POLICY "Borrowers can view action requests for their applications"
    ON public.action_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.loan_applications a
            WHERE a.application_id = action_requests.application_id
              AND a.user_id = auth.uid()
        )
    );

-- action_requests: Borrowers can respond to pending requests for their applications
CREATE POLICY "Borrowers can update action requests with response"
    ON public.action_requests FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.loan_applications a
            WHERE a.application_id = action_requests.application_id
              AND a.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.loan_applications a
            WHERE a.application_id = action_requests.application_id
              AND a.user_id = auth.uid()
        )
    );

-- investigator_notes: STRICTLY HIDDEN FROM BORROWERS (no borrower policy granted)
-- Only service role or authorized lenders have access.
CREATE POLICY "Lenders can manage investigator notes"
    ON public.investigator_notes FOR ALL
    USING (
        (auth.jwt() ->> 'role') = 'lender' OR 
        (auth.jwt() ->> 'email') LIKE '%@trustledger.%' OR
        auth.role() = 'service_role'
    );
