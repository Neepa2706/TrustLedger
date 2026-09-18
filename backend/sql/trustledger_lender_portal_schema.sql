-- =============================================================================
-- TRUSTLEDGER - COMPREHENSIVE LENDER PORTAL & DECISIONING POSTGRESQL SCHEMA
-- =============================================================================
-- Supports authoritative underwriting records, multi-pillar forensics,
-- fraud networks, tamper-evident SHA-256 evidence ledgers, and security alerts.
--
-- Security & Data Isolation Architecture:
-- 1. Profiles: Strict separation between BORROWER and LENDER_* roles.
-- 2. Borrower Isolation: Borrowers can only read borrower-safe statuses & requests.
-- 3. Confidential Investigation Data: Internal notes, fraud graphs, and security
--    telemetry are strictly restricted to authenticated lender roles.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PROFILES EXTENSION (Role-Based Access)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(20),
    role VARCHAR(30) NOT NULL DEFAULT 'BORROWER' CHECK (
        role IN ('BORROWER', 'LENDER_ADMIN', 'UNDERWRITER', 'LOAN_OFFICER')
    ),
    company_name VARCHAR(255),
    organization_type VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    occupation VARCHAR(100),
    employment_type VARCHAR(100),
    monthly_income NUMERIC(12, 2),
    aadhaar_hash VARCHAR(64),
    aadhaar_masked VARCHAR(20),
    pan_hash VARCHAR(64),
    pan_masked VARCHAR(20),
    bank_account_masked VARCHAR(30),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- -----------------------------------------------------------------------------
-- 2. LOAN PRODUCTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loan_products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    min_amount NUMERIC(12, 2) NOT NULL,
    max_amount NUMERIC(12, 2) NOT NULL,
    min_duration_months INTEGER NOT NULL,
    max_duration_months INTEGER NOT NULL,
    min_interest_rate NUMERIC(5, 2) NOT NULL,
    max_interest_rate NUMERIC(5, 2) NOT NULL,
    processing_fee_percentage NUMERIC(5, 2) DEFAULT 2.0,
    required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    eligibility_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. LOAN APPLICATIONS TABLE (Authoritative Single Source of Status)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loan_applications (
    application_id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    loan_product_id VARCHAR(50) NOT NULL REFERENCES public.loan_products(id),
    loan_product_name VARCHAR(255) NOT NULL,
    requested_amount NUMERIC(12, 2) NOT NULL,
    requested_duration_months INTEGER NOT NULL,
    loan_purpose TEXT NOT NULL,
    estimated_emi NUMERIC(10, 2),
    total_repayment NUMERIC(12, 2),
    
    -- Canonical Application Status
    application_status VARCHAR(30) NOT NULL DEFAULT 'DRAFT' CHECK (
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
    ),
    
    -- Risk Telemetry (Internal)
    risk_score INTEGER DEFAULT 25,
    risk_level VARCHAR(20) DEFAULT 'LOW' CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    document_status VARCHAR(20) DEFAULT 'Review',
    kyc_status VARCHAR(20) DEFAULT 'Verified',
    network_status VARCHAR(20) DEFAULT 'Clear',
    integrity_status VARCHAR(20) DEFAULT 'Verified',

    financial_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    verified_applicant JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loan_applications_user ON public.loan_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON public.loan_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_risk ON public.loan_applications(risk_level);

-- -----------------------------------------------------------------------------
-- 4. LOAN APPLICATION DOCUMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loan_application_documents (
    document_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_path TEXT,
    sha256_hash VARCHAR(64) NOT NULL,
    quality_status VARCHAR(20) DEFAULT 'GOOD' CHECK (quality_status IN ('GOOD', 'WARNING', 'ERROR')),
    quality_message TEXT,
    heuristic_match VARCHAR(20) DEFAULT 'MATCH' CHECK (heuristic_match IN ('MATCH', 'REVIEW', 'MISMATCH')),
    is_pre_verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_docs_app ON public.loan_application_documents(application_id);

-- -----------------------------------------------------------------------------
-- 5. APPLICATION EVENTS TABLE (Tamper-Evident Chronological History)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.application_events (
    event_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (
        event_type IN (
            'APPLICATION_RECEIVED',
            'DOCUMENT_ANALYZED',
            'KYC_COMPLETED',
            'NETWORK_SIGNAL_DETECTED',
            'EVIDENCE_VERIFIED',
            'UNDER_REVIEW',
            'ACTION_REQUESTED',
            'ACTION_RESPONDED',
            'APPROVED',
            'REJECTED'
        )
    ),
    actor_type VARCHAR(30) NOT NULL DEFAULT 'SYSTEM' CHECK (actor_type IN ('BORROWER', 'UNDERWRITER', 'SYSTEM')),
    actor_id VARCHAR(100),
    event_summary TEXT NOT NULL,
    event_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    previous_hash VARCHAR(64),
    event_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_events_app ON public.application_events(application_id);

-- -----------------------------------------------------------------------------
-- 6. LENDER REVIEWS & DECISIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lender_reviews (
    review_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    reviewer_id VARCHAR(100) NOT NULL,
    reviewer_name VARCHAR(255) NOT NULL DEFAULT 'Authorized Underwriter',
    review_status VARCHAR(30) NOT NULL DEFAULT 'UNDER_REVIEW' CHECK (
        review_status IN ('UNDER_REVIEW', 'ACTION_REQUIRED', 'APPROVED', 'REJECTED')
    ),
    decision VARCHAR(30) CHECK (
        decision IN ('APPROVED', 'REJECTED', 'REQUEST_ACTION')
    ),
    decision_reason TEXT,
    approved_amount NUMERIC(12, 2),
    approved_duration_months INTEGER,
    approved_interest_rate NUMERIC(5, 2),
    approved_emi NUMERIC(10, 2),
    processing_fee NUMERIC(10, 2) DEFAULT 0,
    internal_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lender_reviews_app ON public.lender_reviews(application_id);

-- -----------------------------------------------------------------------------
-- 7. ACTION REQUESTS TABLE (Information Requests to Borrower)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.action_requests (
    request_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    requested_by VARCHAR(100) NOT NULL,
    request_type VARCHAR(50) NOT NULL DEFAULT 'DOCUMENT_CLARIFICATION' CHECK (
        request_type IN ('DOCUMENT_CLARIFICATION', 'INCOME_PROOF_REUPLOAD', 'BANK_STATEMENT_REUPLOAD', 'IDENTITY_MISMATCH', 'FINANCIAL_CLARIFICATION', 'OTHER')
    ),
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESOLVED', 'CANCELLED')),
    borrower_response TEXT,
    response_document_id VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_action_requests_app ON public.action_requests(application_id);

-- -----------------------------------------------------------------------------
-- 8. EVIDENCE LEDGER TABLE (Tamper-Evident SHA-256 Hash Chaining)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evidence_ledger (
    evidence_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    integrity_status VARCHAR(20) NOT NULL DEFAULT 'VERIFIED' CHECK (
        integrity_status IN ('VERIFIED', 'WARNING', 'HASH_MISMATCH')
    ),
    tamper_flag BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(100) DEFAULT 'System SHA-256 Engine',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_ledger_app ON public.evidence_ledger(application_id);

-- -----------------------------------------------------------------------------
-- 9. SECURITY EVENTS TABLE (Suspicious Activity Telemetry)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.security_events (
    event_id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50) NOT NULL CHECK (
        category IN ('SUSPICIOUS_ACTIVITY', 'DOCUMENT_ANOMALY', 'MULTIPLE_INCONSISTENCIES', 'NETWORK_SIGNAL', 'UNUSUAL_ACTIVITY')
    ),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('INFO', 'REVIEW', 'HIGH')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    source VARCHAR(100) NOT NULL,
    application_id VARCHAR(50) REFERENCES public.loan_applications(application_id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sec_events_sev ON public.security_events(severity);

-- -----------------------------------------------------------------------------
-- 10. ROW-LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lender_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile; Lenders can view all borrower profiles
CREATE POLICY "Users view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Lenders view borrower profiles" ON public.profiles
    FOR SELECT USING (
        (auth.jwt() ->> 'role') IN ('LENDER_ADMIN', 'UNDERWRITER', 'LOAN_OFFICER') OR
        auth.role() = 'service_role'
    );

-- Loan Applications: Borrowers view own applications; Lenders view all submitted
CREATE POLICY "Borrowers view own applications" ON public.loan_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Borrowers insert own applications" ON public.loan_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Borrowers update own draft applications" ON public.loan_applications
    FOR UPDATE USING (auth.uid() = user_id AND application_status IN ('DRAFT', 'READY_FOR_REVIEW'));

CREATE POLICY "Lenders manage loan applications" ON public.loan_applications
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('LENDER_ADMIN', 'UNDERWRITER', 'LOAN_OFFICER') OR
        auth.role() = 'service_role'
    );

-- Action Requests: Borrowers can read and respond; Lenders manage
CREATE POLICY "Borrowers view action requests" ON public.action_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.loan_applications a
            WHERE a.application_id = action_requests.application_id AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Borrowers respond to action requests" ON public.action_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.loan_applications a
            WHERE a.application_id = action_requests.application_id AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Lenders manage action requests" ON public.action_requests
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('LENDER_ADMIN', 'UNDERWRITER', 'LOAN_OFFICER') OR
        auth.role() = 'service_role'
    );

-- Lender Reviews: STRICTLY HIDDEN FROM BORROWERS
CREATE POLICY "Lenders manage reviews" ON public.lender_reviews
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('LENDER_ADMIN', 'UNDERWRITER', 'LOAN_OFFICER') OR
        auth.role() = 'service_role'
    );

-- Evidence Ledger & Security Events: STRICTLY LENDER / SERVICE ONLY
CREATE POLICY "Lenders view evidence ledger" ON public.evidence_ledger
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('LENDER_ADMIN', 'UNDERWRITER', 'LOAN_OFFICER') OR
        auth.role() = 'service_role'
    );

CREATE POLICY "Lenders view security events" ON public.security_events
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('LENDER_ADMIN', 'UNDERWRITER', 'LOAN_OFFICER') OR
        auth.role() = 'service_role'
    );
