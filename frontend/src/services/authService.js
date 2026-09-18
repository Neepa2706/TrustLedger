/**
 * TrustLedger Authentication Service
 * 
 * ARCHITECTURE NOTE:
 * This service encapsulates all authentication logic, session storage,
 * and institutional verification.
 * It is structured as an adapter ready to connect directly to Supabase Auth
 * in Phase 2B.
 * 
 * CURRENT STATUS: DEMO MODE & PROTOTYPE AUTH
 */

const AUTH_STORAGE_KEY = 'trustledger_session';
const COMPANY_STORAGE_KEY = 'trustledger_registered_company';

const DEMO_USER = {
  id: 'usr_demo_8824',
  email: 'analyst@trustledger.shield',
  name: 'Alex Sterling',
  role: 'Fraud SecOps Lead',
  department: 'Risk Intelligence',
  company: 'TrustLedger Guard Capital',
  isDemo: true,
  lastLogin: new Date().toISOString()
};

// In-memory fallback for non-browser or disabled storage environments
let memoryStore = {};

function getStorage(type = 'local') {
  if (typeof window !== 'undefined') {
    try {
      return type === 'local' ? window.localStorage : window.sessionStorage;
    } catch {
      // Fallback if storage blocked
    }
  }
  return {
    getItem: (key) => memoryStore[key] || null,
    setItem: (key, val) => { memoryStore[key] = String(val); },
    removeItem: (key) => { delete memoryStore[key]; }
  };
}

class AuthService {
  /**
   * Retrieve current stored user session
   */
  getCurrentUser() {
    try {
      const local = getStorage('local').getItem(AUTH_STORAGE_KEY);
      const session = getStorage('session').getItem(AUTH_STORAGE_KEY);
      const sessionData = local || session;
      if (!sessionData) return null;
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Check if current session is Demo Mode
   */
  isDemoMode() {
    const user = this.getCurrentUser();
    return Boolean(user && user.isDemo);
  }

  /**
   * Register and verify a lending institution
   */
  async registerCompany(companyData) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const sanitizedEmail = String(companyData.corporateEmail || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!companyData.companyName || companyData.companyName.trim().length < 2) {
      throw new Error('Please enter a valid institution or company legal name.');
    }

    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
      throw new Error('Please enter a valid corporate work email address.');
    }

    if (!companyData.registrationNumber || companyData.registrationNumber.trim().length < 4) {
      throw new Error('Please enter a valid regulatory registration number (LEI, CIN, or EIN).');
    }

    if (!companyData.password || companyData.password.length < 6) {
      throw new Error('Please enter a secure password (minimum 6 characters).');
    }

    const companyRecord = {
      id: `inst_${Math.random().toString(36).slice(2, 9)}`,
      companyName: companyData.companyName.trim(),
      corporateEmail: sanitizedEmail,
      registrationNumber: companyData.registrationNumber.trim().toUpperCase(),
      lenderType: companyData.lenderType || 'Digital NBFC',
      jurisdiction: companyData.jurisdiction || 'United States',
      officerName: companyData.officerName?.trim() || 'Chief Risk Officer',
      isVerified: true,
      verificationStatus: 'REGISTRY_VALIDATED',
      registeredAt: new Date().toISOString()
    };

    getStorage('local').setItem(COMPANY_STORAGE_KEY, JSON.stringify(companyRecord));
    return companyRecord;
  }

  /**
   * Retrieve registered company profile if one exists
   */
  getRegisteredCompany() {
    try {
      const data = getStorage('local').getItem(COMPANY_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Sign in with email and password
   */
  async login(email, password, rememberMe = true) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const sanitizedEmail = String(email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
      throw new Error('Please enter a valid work email address.');
    }

    if (!password || password.length < 6) {
      throw new Error('Please enter a valid password (minimum 6 characters).');
    }

    const registeredCompany = this.getRegisteredCompany();
    const isMatchingRegistered = registeredCompany && registeredCompany.corporateEmail === sanitizedEmail;

    // Build session payload
    const userSession = {
      id: `usr_${Math.random().toString(36).slice(2, 9)}`,
      email: sanitizedEmail,
      name: isMatchingRegistered ? registeredCompany.officerName : sanitizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: 'Fraud Investigation Analyst',
      company: isMatchingRegistered ? registeredCompany.companyName : 'Digital Lending Group',
      department: 'Digital Lending Risk & Underwriting',
      isDemo: false,
      lastLogin: new Date().toISOString()
    };

    const storage = rememberMe ? getStorage('local') : getStorage('session');
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));

    return userSession;
  }

  /**
   * Start Demo Mode session (for hackathon evaluation)
   */
  async startDemoSession() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const demoPayload = {
      ...DEMO_USER,
      lastLogin: new Date().toISOString()
    };
    getStorage('session').setItem(AUTH_STORAGE_KEY, JSON.stringify(demoPayload));
    return demoPayload;
  }

  /**
   * Sign out and clear stored session
   */
  async logout() {
    getStorage('local').removeItem(AUTH_STORAGE_KEY);
    getStorage('session').removeItem(AUTH_STORAGE_KEY);
    memoryStore = {};
    return true;
  }
}

export const authService = new AuthService();
export default authService;
