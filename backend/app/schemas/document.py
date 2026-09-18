from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float
    page: int = 1

class ForensicFinding(BaseModel):
    id: str
    type: str  # metadata, formatting, layout, ocr_mismatch, visual
    severity: str  # low, medium, high
    title: str
    description: str
    location: Optional[str] = None
    bbox: Optional[BoundingBox] = None

class DocumentMetadata(BaseModel):
    page_count: int
    title: Optional[str] = "Not available"
    author: Optional[str] = "Not available"
    creator: Optional[str] = "Not available"
    producer: Optional[str] = "Not available"
    creation_date: Optional[str] = "Not available"
    modification_date: Optional[str] = "Not available"
    fonts: List[str] = Field(default_factory=list)
    image_count: int = 0
    file_size_bytes: int = 0
    file_size_formatted: str = "0 KB"
    page_dimensions: Optional[str] = "Not available"

class OCRResult(BaseModel):
    available: bool
    text: Optional[str] = ""
    confidence: Optional[float] = 0.0
    engine: Optional[str] = "Tesseract"
    character_count: int = 0
    reason: Optional[str] = None

class VisualSignals(BaseModel):
    image_regions_analyzed: int = 0
    suspicious_regions: int = 0
    layout_consistency: int = 100
    font_consistency: int = 100
    ocr_consistency: int = 100

class TextAnalysis(BaseModel):
    total_characters: int = 0
    total_blocks: int = 0
    extracted_text_preview: str = ""
    currency_tokens_detected: List[str] = Field(default_factory=list)
    sensitive_entities_masked: bool = True

class DocumentAnalysisResponse(BaseModel):
    document_id: str
    application_id: str
    filename: str
    document_type: str
    risk_score: int
    risk_level: str  # LOW, MEDIUM, HIGH
    findings: List[ForensicFinding] = Field(default_factory=list)
    metadata: DocumentMetadata
    ocr: OCRResult
    visual_signals: VisualSignals
    text_analysis: TextAnalysis
    recommended_action: str
    analysis_timestamp: str

class DocumentUploadResponse(BaseModel):
    document_id: str
    application_id: str
    filename: str
    document_type: str
    file_size: int
    upload_timestamp: str
    status: str
