-- =============================================================================
-- TRUSTLEDGER USER APP - SUPABASE / POSTGRESQL DATABASE SCHEMA (PHASE 1)
-- =============================================================================
-- Product Rule: ONE PERSON = ONE USER ACCOUNT
-- Cryptographic data isolation with Row Level Security (RLS)
-- Sensitive data minimization: Never store full Aadhaar or raw passphrases
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. USER PROFILES TABLE (Linked to Supabase auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    occupation VARCHAR(100),
    employment_type VARCHAR(50),
    monthly_income NUMERIC(14, 2),
    
    -- Sensitive identifiers (Minimization: Masked representation and last-4 only)
    aadhaar_last4 CHAR(4),
    aadhaar_masked VARCHAR(20),
    pan_last4 CHAR(4),
    pan_masked VARCHAR(20),
    aadhaar_name VARCHAR(150),

    -- Status metrics
    profile_status VARCHAR(30) DEFAULT 'IN_PROGRESS' CHECK (profile_status IN ('IN_PROGRESS', 'COMPLETED', 'VERIFIED')),
    verification_status VARCHAR(30) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'IN_PROGRESS', 'VERIFIED', 'MISMATCH', 'REJECTED')),
    completion_percentage INT DEFAULT 20 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user_id lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- -----------------------------------------------------------------------------
-- 2. USER IDENTITY DOCUMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_identity_documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.user_profiles(profile_id) ON DELETE CASCADE,
    document_type VARCHAR(50) DEFAULT 'Aadhaar Card',
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    
    -- Quality inspection results
    is_readable BOOLEAN DEFAULT TRUE,
    blur_score NUMERIC(8, 2),
    brightness_score NUMERIC(8, 2),
    quality_warnings TEXT[],

    -- Extracted OCR signals
    extracted_name VARCHAR(150),
    extracted_dob VARCHAR(50),
    extracted_aadhaar_last4 CHAR(4),

    status VARCHAR(30) DEFAULT 'UPLOADED' CHECK (status IN ('UPLOADED', 'INSPECTED', 'VERIFIED', 'FLAGGED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_identity_documents_user_id ON public.user_identity_documents(user_id);

-- -----------------------------------------------------------------------------
-- 3. USER PROFILE PHOTOGRAPHS TABLE (Live Camera Captures)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profile_photos (
    photo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    profile_id UUID REFERENCES public.user_profiles(profile_id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    
    is_live_capture BOOLEAN DEFAULT TRUE NOT NULL,
    face_detected BOOLEAN DEFAULT TRUE,
    single_face BOOLEAN DEFAULT TRUE,
    blur_score NUMERIC(8, 2),
    brightness_score NUMERIC(8, 2),
    
    status VARCHAR(30) DEFAULT 'CAPTURED' CHECK (status IN ('CAPTURED', 'VERIFIED', 'RETRACTED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profile_photos_user_id ON public.user_profile_photos(user_id);

-- -----------------------------------------------------------------------------
-- 4. VERIFICATION LOGS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_verification_records (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.user_profiles(profile_id) ON DELETE CASCADE,
    verification_type VARCHAR(100) DEFAULT 'Document-based identity verification',
    overall_status VARCHAR(30) DEFAULT 'PENDING' CHECK (overall_status IN ('PENDING', 'IN_PROGRESS', 'VERIFIED', 'MISMATCH', 'REJECTED')),
    checks_summary JSONB NOT NULL DEFAULT '[]'::jsonb,
    mismatches JSONB DEFAULT '[]'::jsonb,
    is_demo BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_verification_records_user_id ON public.user_verification_records(user_id);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES - STRICT SINGLE-PERSON ISOLATION
-- -----------------------------------------------------------------------------
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_identity_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_verification_records ENABLE ROW LEVEL SECURITY;

-- 1. user_profiles Policies
CREATE POLICY "Users can only select their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. user_identity_documents Policies
CREATE POLICY "Users can only access their own identity documents"
    ON public.user_identity_documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own identity documents"
    ON public.user_identity_documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own identity documents"
    ON public.user_identity_documents FOR DELETE
    USING (auth.uid() = user_id);

-- 3. user_profile_photos Policies
CREATE POLICY "Users can only access their own profile photos"
    ON public.user_profile_photos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own profile photos"
    ON public.user_profile_photos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 4. user_verification_records Policies
CREATE POLICY "Users can only access their own verification records"
    ON public.user_verification_records FOR SELECT
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- STORAGE BUCKETS (Private identity vault)
-- -----------------------------------------------------------------------------
-- insert into storage.buckets (id, name, public) values ('borrower_documents', 'borrower_documents', false);
-- insert into storage.buckets (id, name, public) values ('borrower_photos', 'borrower_photos', false);
