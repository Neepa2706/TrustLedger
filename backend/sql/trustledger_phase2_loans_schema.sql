-- =============================================================================
-- TRUSTLEDGER USER APP - PHASE 2 LOANS & APPLICATIONS SCHEMA
-- =============================================================================
-- Product Rule: ONE PERSON = ONE USER ACCOUNT
-- User Data Isolation: Borrowers can strictly view and edit only their own applications
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. LOAN PRODUCTS CATALOG TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loan_products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    min_amount NUMERIC(14, 2) NOT NULL,
    max_amount NUMERIC(14, 2) NOT NULL,
    min_duration_months INT NOT NULL,
    max_duration_months INT NOT NULL,
    min_interest_rate NUMERIC(5, 2) NOT NULL,
    max_interest_rate NUMERIC(5, 2) NOT NULL,
    processing_fee_percentage NUMERIC(5, 2) DEFAULT 2.0,
    processing_fee_description VARCHAR(255),
    purpose_options JSONB NOT NULL DEFAULT '[]'::jsonb,
    required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    eligibility_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
    demo_only BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. LOAN APPLICATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loan_applications (
    application_id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    loan_product_id VARCHAR(50) NOT NULL REFERENCES public.loan_products(id),
    requested_amount NUMERIC(14, 2) NOT NULL,
    requested_duration_months INT NOT NULL,
    loan_purpose VARCHAR(255) NOT NULL,
    
    -- Estimates
    estimated_emi NUMERIC(12, 2),
    total_repayment NUMERIC(14, 2),
    total_interest NUMERIC(14, 2),

    -- Workflow step & status
    current_step INT DEFAULT 1 CHECK (current_step >= 1 AND current_step <= 6),
    application_status VARCHAR(30) DEFAULT 'DRAFT' CHECK (
        application_status IN ('DRAFT', 'READY_FOR_REVIEW', 'SUBMITTED', 'UNDER_VERIFICATION', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ACTION_REQUIRED')
    ),
    validation_status VARCHAR(30) DEFAULT 'INCOMPLETE' CHECK (
        validation_status IN ('INCOMPLETE', 'VALID', 'ACTION_REQUIRED')
    ),
    validation_errors JSONB DEFAULT '[]'::jsonb,

    -- Financial entries (Sensitive account number stored masked only)
    employer_or_business_name VARCHAR(150),
    work_experience_years NUMERIC(4, 1),
    monthly_income VARCHAR(50),
    monthly_existing_obligations VARCHAR(50),
    approximate_monthly_expenses VARCHAR(50),
    payout_bank_name VARCHAR(100),
    payout_account_masked VARCHAR(30),
    payout_ifsc_code VARCHAR(20),

    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loan_applications_user_id ON public.loan_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_product_id ON public.loan_applications(loan_product_id);

-- -----------------------------------------------------------------------------
-- 3. LOAN APPLICATION DOCUMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loan_application_documents (
    document_id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL REFERENCES public.loan_applications(application_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(500),
    
    quality_status VARCHAR(20) DEFAULT 'GOOD' CHECK (quality_status IN ('GOOD', 'WARNING', 'ERROR')),
    quality_message TEXT,
    heuristic_type_match VARCHAR(20) DEFAULT 'MATCH' CHECK (heuristic_type_match IN ('MATCH', 'REVIEW', 'MISMATCH')),
    heuristic_message TEXT,
    is_pre_verified BOOLEAN DEFAULT FALSE,

    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loan_app_docs_app_id ON public.loan_application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_loan_app_docs_user_id ON public.loan_application_documents(user_id);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.loan_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_application_documents ENABLE ROW LEVEL SECURITY;

-- 1. loan_products: Public read for active products
CREATE POLICY "Anyone can view active loan products"
    ON public.loan_products FOR SELECT
    USING (active = true);

-- 2. loan_applications: Strict borrower data isolation
CREATE POLICY "Users can only select their own loan applications"
    ON public.loan_applications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own loan applications"
    ON public.loan_applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own loan applications"
    ON public.loan_applications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. loan_application_documents: Strict borrower document isolation
CREATE POLICY "Users can only select their own loan application documents"
    ON public.loan_application_documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own loan application documents"
    ON public.loan_application_documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own loan application documents"
    ON public.loan_application_documents FOR DELETE
    USING (auth.uid() = user_id);
