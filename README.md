# TrustLedger 🛡️

> **AI + Cybersecurity Fraud Shield for Digital Lending**

TrustLedger is an intelligent fraud prevention and evidence intelligence platform engineered for digital lending ecosystems. It bridges the trust gap between borrowers and digital lenders by synthesizing behavioral telemetry, cryptographic document forensics, camera-based KYC checks, entity resolution, and tamper-evident audit logging into an explainable, human-in-the-loop underwriting workflow.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Demo Mode](#-demo-mode)
- [Prototype / Hackathon Disclaimer](#-prototype--hackathon-disclaimer)
- [Setup Instructions](#-setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Security & Privacy](#-security--privacy)
- [License](#-license)

---

## 🔍 Overview

TrustLedger helps digital lenders evaluate the authenticity and trustworthiness of digital loan evidence using five core pillars:
1. **Document Forensics**: Metadata inspection, font/kerning anomaly detection, and layout consistency checks.
2. **Video & KYC Signals**: Camera-based liveness verification, facial sharpness, and single-account identity verification.
3. **Fraud Network Analysis**: Device fingerprinting, shared telemetry clusters, and synthetic identity graph mapping.
4. **Evidence Integrity**: SHA-256 cryptographic hashing and tamper-evident chained audit logging.
5. **Explainable Risk Assessment**: Multi-pillar composite risk scoring with explicit human-in-the-loop underwriter signoff.

### Borrower Portal Capabilities:
- **Secure Authentication**: Email/password, Supabase Google OAuth, and 1-Click Demo Mode.
- **Profile Verification**: Single-account identity enrollment, DOB, address, and live device camera photograph capture.
- **Loan Marketplace**: Browse curated credit categories (Personal, Instant Cash, Business Support, Vehicle, Education) with interactive real-time EMI calculators.
- **Loan Application Form**: Multi-step application submission with financial inputs and payout account verification.
- **Document Submission & Cross-Check**: Upload identity, income, and bank proofs with optical quality checks and cross-field comparison.
- **Application Tracking**: Chronological status tracker synchronized in real time with lender underwriting decisions (`SUBMITTED`, `UNDER_REVIEW`, `ACTION_REQUIRED`, `APPROVED`, `REJECTED`).

---

## 🏛️ Architecture

```text
Borrower App (React + Vite + Tailwind)
     ↓
FastAPI Backend (Python 3.10+)
     ↓
TrustLedger Verification Services
     ├── Document Forensics (PyMuPDF, pdfplumber, OpenCV)
     ├── KYC Signals (Pillow, Face Quality Heuristics)
     ├── Fraud Network (NetworkX, Telemetry Clustering)
     ├── Risk Engine (Composite Scoring & Explainability)
     └── Evidence Integrity (SHA-256 Chained Hash Ledger)
     ↓
Supabase (Optional Cloud Tier)
 ├── PostgreSQL & RLS
 ├── Auth (OAuth / Passwordless)
 └── Storage (Private Document Buckets)
     ↓
Lender Investigation Portal (Underwriter Triage & Decision Panel)
```

---

## 💻 Tech Stack

### Frontend
- **React**: Declarative component architecture
- **Vite**: Ultra-fast module bundler & HMR
- **Tailwind CSS**: Fintech dark-mode cybersecurity design system
- **React Router**: Client-side single-page routing
- **Recharts**: Precision risk score distributions and analytics
- **React Flow (`@xyflow/react`)**: Interactive entity cluster & fraud network visualization
- **Lucide React**: Vector iconography
- **Framer Motion**: Telemetry transitions and status animations

### Backend
- **Python (3.10+)**: Core language
- **FastAPI**: Asynchronous high-performance REST API
- **Uvicorn**: Production-grade ASGI web server
- **Pydantic**: Type validation and schema enforcement

### Database / Auth / Storage
- **Supabase PostgreSQL**: Relational data store with Row-Level Security (RLS)
- **Supabase Auth**: JWT tokens, OAuth, and session management
- **Supabase Storage**: Secure document bucket isolation

### AI / Security / Forensics
- **PyMuPDF (`fitz`)**: PDF structure & metadata extraction
- **pdfplumber**: Character stream & layout inspection
- **Tesseract / EasyOCR**: Text extraction & optical token alignment
- **OpenCV & Pillow**: Image quality analysis, Laplacian sharpness, face framing
- **PyTorch & scikit-learn**: Feature vector pipelines & classification heuristics
- **MediaPipe**: Landmark & facial framing checks
- **NetworkX**: Bipartite & entity cluster graph analysis
- **Python `hashlib`**: SHA-256 cryptographic verification & tamper-evident audit chaining

---

## ⚡ Demo Mode

TrustLedger includes an automated **Demo Mode** to evaluate the end-to-end verification and underwriting cycle without configuring external credentials:
- **Pre-seeded Demo Application**: `TL-APP-10001` (Applicant: *Arjun Kumar*, Personal Loan: ₹2,00,000, 24 Months, Risk Score: 68% MEDIUM).
- **1-Click Applicant Sign In**: Instantly authenticates as demo applicant *Arjun Kumar* with pre-verified KYC profile.
- **Lender Underwriter Workspace**: Authoritative review queue at `/applications/TL-APP-10001` allowing underwriters to:
  - Review 5-pillar forensics and cryptographic hashes.
  - Record private investigator audit notes.
  - Issue **Action Requests** (e.g. upload clearer bank statement).
  - Issue **Approval** with customized sanctioned loan terms.
- **Real-Time Borrower Sync**: Borrower status page (`/my-applications/TL-APP-10001`) updates live as decisions are made.

---

## ⚠️ Prototype / Hackathon Disclaimer

TrustLedger is developed as a hackathon proof-of-concept demonstration.

### Implemented
- Complete end-to-end borrower application workflow (registration, camera capture, loan selection, document submission, KYC review).
- Human-in-the-loop lender underwriter decisioning authority (Approve, Request Action, Reject).
- Tamper-evident SHA-256 audit trail chaining.
- Optical sharpness and dimension checking for camera captures.
- In-memory and Supabase-compatible multi-tenant data schemas with strict IDOR protections.

### Prototype / Heuristics
- Document forensics heuristics (kerning, font anomaly scoring).
- Optical character recognition token matching.
- Fraud graph clustering signals (device ID, subnet collision).
- Composite risk score algorithm (advisory only).

### Not Claimed
- Official government Aadhaar API integration (all Aadhaar, PAN, and bank accounts are synthetic and masked with `XXXX`).
- 100% deepfake detection certainty.
- Fully automated algorithmic credit approvals (in compliance with RBI digital lending guidelines, all binding credit decisions must be authorized by a human underwriter).

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js**: `v18+` (recommended `v20+` or `v22+`)
- **Python**: `3.10+`

---

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # macOS / Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

5. **Start the FastAPI server**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   - API Docs: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/health`

---

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install npm dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment (optional for Demo Mode)**:
   ```bash
   cp .env.example .env
   ```

4. **Start the Vite development server**:
   ```bash
   npm run dev -- --host 0.0.0.0 --port 5173
   ```
   - Application URL: `http://localhost:5173`

---

## 🔒 Security & Privacy

- **Zero Exposure of Personal Data**: All demo credentials, Aadhaar IDs (`XXXX XXXX 4821`), and account numbers are strictly masked synthetic demo data.
- **Strict Data Isolation**: Confidential investigator notes and fraud network graphs are filtered server-side and never exposed to borrower APIs.
- **Clean Git Tracking**: Environment variables (`.env`), temporary files, local uploads, and personal test documents are strictly excluded via `.gitignore`.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
