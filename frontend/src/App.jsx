import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserAuthProvider, useUserAuth } from './context/UserAuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// Existing Lender / Investigator Pages (Preserved 100%)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import FraudNetworkPage from './pages/FraudNetworkPage';
import DocumentsPage from './pages/DocumentsPage';
import KycAnalysisPage from './pages/KycAnalysisPage';
import EvidenceLedgerPage from './pages/EvidenceLedgerPage';
import ApprovedLoansPage from './pages/ApprovedLoansPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';

// Customer / Borrower App Pages (Phase 1 & Phase 2)
import UserLoginPage from './pages/user/UserLoginPage';
import UserRegisterPage from './pages/user/UserRegisterPage';
import ProfileSetupPage from './pages/user/ProfileSetupPage';
import UserHomePage from './pages/user/UserHomePage';
import UserPlaceholderPage from './pages/user/UserPlaceholderPage';
import UserProfileViewPage from './pages/user/UserProfileViewPage';
import UserPaymentsPage from './pages/user/UserPaymentsPage';
import UserNotificationsPage from './pages/user/UserNotificationsPage';
import LoanMarketplacePage from './pages/user/LoanMarketplacePage';
import LoanDetailsPage from './pages/user/LoanDetailsPage';
import LoanApplicationPage from './pages/user/LoanApplicationPage';
import FinalVerificationPage from './pages/user/FinalVerificationPage';
import MyApplicationsPage from './pages/user/MyApplicationsPage';
import ApplicationStatusPage from './pages/user/ApplicationStatusPage';
import UserLayout from './components/user/UserLayout';

/**
 * Root Redirect Handler: Routes to active workspace
 */
function RootIndexRedirect() {
  const { isAuthenticated: isLenderAuth } = useAuth();
  const { isAuthenticated: isBorrowerAuth, profile } = useUserAuth();

  if (isLenderAuth) {
    return <Navigate to="/dashboard" replace />;
  }
  if (isBorrowerAuth) {
    const isVerified = profile?.verification_status === 'VERIFIED' || profile?.completion_percentage === 100;
    if (isVerified) {
      return <Navigate to="/loans" replace />;
    }
    return <Navigate to="/profile-setup" replace />;
  }
  return <Navigate to="/login" replace />;
}

/**
 * Public Borrower Login Guard
 */
function BorrowerLoginGuard() {
  return <UserLoginPage />;
}

/**
 * Borrower Protected Route Guard (Must be logged in)
 */
function BorrowerProtectedRoute({ children }) {
  const { isAuthenticated } = useUserAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

/**
 * Borrower Verified Route Guard
 * Enforces: REGISTRATION -> COMPLETE VERIFICATION -> LOANS
 * The applicant must NOT reach /loans or apply until verification is complete!
 */
function BorrowerVerifiedRoute({ children }) {
  const { isAuthenticated, profile, loading } = useUserAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If profile is loading, wait briefly
  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-coffee-600 border-t-transparent" />
      </div>
    );
  }

  const isVerified = profile?.verification_status === 'VERIFIED' || profile?.completion_percentage === 100;
  if (!isVerified) {
    return (
      <Navigate
        to="/profile-setup"
        state={{
          from: location,
          warningMessage: 'Please complete your profile verification before applying for a loan.'
        }}
        replace
      />
    );
  }

  return children;
}

/**
 * Lender Login Guard (Preserved at /lender/login)
 */
function LenderLoginGuard() {
  return <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            {/* Root Route */}
            <Route path="/" element={<RootIndexRedirect />} />

            {/* =================================================================
                PHASE 1: CUSTOMER / BORROWER APPLICATION ROUTES
                ================================================================= */}
            {/* Borrower Public Auth Routes */}
            <Route path="/login" element={<BorrowerLoginGuard />} />
            <Route path="/register" element={<UserRegisterPage />} />

            {/* Borrower Profile Setup Wizard */}
            <Route
              path="/profile-setup"
              element={
                <BorrowerProtectedRoute>
                  <ProfileSetupPage />
                </BorrowerProtectedRoute>
              }
            />
            {/* Alias for camera photograph setup */}
            <Route path="/profile-photo" element={<Navigate to="/profile-setup" replace />} />

            {/* Borrower Portal Pages (UserLayout) */}
            <Route element={<UserLayout />}>
              {/* Loan Marketplace & Details - Strictly guarded by verification */}
              <Route
                path="/loans"
                element={
                  <BorrowerVerifiedRoute>
                    <LoanMarketplacePage />
                  </BorrowerVerifiedRoute>
                }
              />
              <Route
                path="/loans/:loanId"
                element={
                  <BorrowerVerifiedRoute>
                    <LoanDetailsPage />
                  </BorrowerVerifiedRoute>
                }
              />

              {/* Protected Borrower Portal Pages */}
              <Route
                path="/home"
                element={
                  <BorrowerProtectedRoute>
                    <UserHomePage />
                  </BorrowerProtectedRoute>
                }
              />
              <Route
                path="/loans/:loanId/apply"
                element={
                  <BorrowerVerifiedRoute>
                    <LoanApplicationPage />
                  </BorrowerVerifiedRoute>
                }
              />
              <Route
                path="/loans/:loanId/apply/verification"
                element={
                  <BorrowerVerifiedRoute>
                    <FinalVerificationPage />
                  </BorrowerVerifiedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <BorrowerVerifiedRoute>
                    <MyApplicationsPage />
                  </BorrowerVerifiedRoute>
                }
              />
              <Route
                path="/my-applications/:applicationId"
                element={
                  <BorrowerVerifiedRoute>
                    <ApplicationStatusPage />
                  </BorrowerVerifiedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <BorrowerVerifiedRoute>
                    <UserPaymentsPage />
                  </BorrowerVerifiedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <BorrowerProtectedRoute>
                    <UserProfileViewPage />
                  </BorrowerProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <BorrowerProtectedRoute>
                    <UserNotificationsPage />
                  </BorrowerProtectedRoute>
                }
              />
            </Route>

            {/* =================================================================
                EXISTING LENDER / INVESTIGATION DASHBOARD ROUTES (PRESERVED)
                ================================================================= */}
            {/* Lender Public Auth Routes */}
            <Route path="/lender/login" element={<LenderLoginGuard />} />
            <Route path="/lender/register" element={<RegisterPage />} />

            {/* Protected Investigation Workspace */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/applications/:id" element={<ApplicationDetailPage />} />
                <Route path="/fraud-network" element={<FraudNetworkPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                
                {/* KYC Analysis with alias */}
                <Route path="/kyc-analysis" element={<KycAnalysisPage />} />
                <Route path="/kyc" element={<Navigate to="/kyc-analysis" replace />} />

                {/* Evidence Ledger with alias */}
                <Route path="/evidence-ledger" element={<EvidenceLedgerPage />} />
                <Route path="/ledger" element={<Navigate to="/evidence-ledger" replace />} />

                {/* Approved Loans & Payment Servicing */}
                <Route path="/approved-loans" element={<ApprovedLoansPage />} />

                {/* Suspicious Activity & Operational Alerts */}
                <Route path="/alerts" element={<AlertsPage />} />

                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Fallback to Root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserAuthProvider>
    </AuthProvider>
  );
}
