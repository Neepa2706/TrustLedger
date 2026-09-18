"""
TrustLedger User App - Borrower Profile & Verification Schemas
Defines request/response models for borrower identity, profile setup,
document inspection, and camera photograph verification.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime


class UserProfileBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., min_length=3, max_length=120)
    mobile: str = Field(..., min_length=10, max_length=15)
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    occupation: Optional[str] = None
    employment_type: Optional[str] = None
    monthly_income: Optional[str] = None


class UserProfileCreate(UserProfileBase):
    user_id: Optional[str] = None


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    mobile: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    occupation: Optional[str] = None
    employment_type: Optional[str] = None
    monthly_income: Optional[str] = None
    # Identity details (sensitive - stored as masked)
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None
    aadhaar_name: Optional[str] = None


class UserProfileResponse(UserProfileBase):
    profile_id: str
    user_id: str
    aadhaar_last4: Optional[str] = None
    aadhaar_masked: Optional[str] = None
    pan_last4: Optional[str] = None
    pan_masked: Optional[str] = None
    aadhaar_name: Optional[str] = None
    profile_status: str = "IN_PROGRESS"  # IN_PROGRESS, COMPLETED, VERIFIED
    verification_status: str = "PENDING"  # PENDING, IN_PROGRESS, VERIFIED, REJECTED
    has_document: bool = False
    has_photo: bool = False
    completion_percentage: int = 0
    created_at: str
    updated_at: str


class DocumentQualityCheck(BaseModel):
    is_valid: bool
    readable: bool
    blur_score: float
    brightness_score: float
    dimensions: Dict[str, int]
    warnings: List[str] = []


class IdentityDocumentResponse(BaseModel):
    document_id: str
    user_id: str
    filename: str
    file_type: str
    file_size_bytes: int
    quality_check: DocumentQualityCheck
    extracted_name: Optional[str] = None
    extracted_dob: Optional[str] = None
    extracted_aadhaar_last4: Optional[str] = None
    uploaded_at: str
    status: str = "UPLOADED"


class ProfilePhotoResponse(BaseModel):
    photo_id: str
    user_id: str
    filename: str
    is_live_capture: bool = True
    face_detected: bool = True
    single_face: bool = True
    blur_score: float
    brightness_score: float
    captured_at: str
    status: str = "CAPTURED"


class VerificationCheckItem(BaseModel):
    key: str
    title: str
    status: str  # "completed", "passed", "processing", "failed", "pending"
    detail: Optional[str] = None


class VerificationStatusResponse(BaseModel):
    user_id: str
    profile_id: str
    overall_status: str  # "VERIFIED", "IN_PROGRESS", "MISMATCH", "PENDING"
    verification_type: str = "Document-based identity verification"
    is_demo: bool = False
    checks: List[VerificationCheckItem]
    mismatches: List[str] = []
    verified_at: Optional[str] = None
    message: str
