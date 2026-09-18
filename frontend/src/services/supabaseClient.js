/**
 * TrustLedger Supabase Client Configuration
 * 
 * Manages Supabase Auth, Google OAuth, and Private Storage.
 * Provides a clean development fallback labeled as DEMO MODE
 * when environment variables are not yet configured.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('your-project')
);

let supabase = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    supabase = null;
  }
}

/**
 * Mock Supabase Auth provider for offline demo / hackathon evaluation
 */
const mockSupabase = {
  auth: {
    async getSession() {
      const stored = localStorage.getItem('trustledger_user_session');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          return { data: { session: { user, access_token: `demo_${user.id}` } }, error: null };
        } catch {
          return { data: { session: null }, error: null };
        }
      }
      return { data: { session: null }, error: null };
    },
    async signInWithPassword({ email, password }) {
      await new Promise(r => setTimeout(r, 450));
      if (!email || !password) {
        return { data: null, error: { message: 'Please enter your email and password.' } };
      }
      if (password.length < 6) {
        return { data: null, error: { message: 'Email or password is incorrect.' } };
      }
      const user = {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email: email.trim().toLowerCase(),
        user_metadata: {
          full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        },
        isDemo: true
      };
      return { data: { user, session: { user, access_token: `demo_${user.id}` } }, error: null };
    },
    async signUp({ email, password, options }) {
      await new Promise(r => setTimeout(r, 550));
      if (!email || !password) {
        return { data: null, error: { message: 'Please provide email and password.' } };
      }
      const user = {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email: email.trim().toLowerCase(),
        user_metadata: options?.data || {},
        isDemo: true
      };
      return { data: { user, session: { user, access_token: `demo_${user.id}` } }, error: null };
    },
    async signInWithOAuth({ provider, options }) {
      await new Promise(r => setTimeout(r, 600));
      // Minimal scopes only: name, email, profile
      const user = {
        id: `usr_google_${Math.random().toString(36).substring(2, 8)}`,
        email: 'applicant.google@trustledger.in',
        user_metadata: {
          full_name: 'Priya Sharma',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          provider: 'google'
        },
        app_metadata: { provider: 'google' },
        isDemo: true
      };
      return { data: { user, session: { user, access_token: `demo_${user.id}` } }, error: null };
    },
    async signOut() {
      localStorage.removeItem('trustledger_user_session');
      return { error: null };
    },
    async resetPasswordForEmail(email) {
      await new Promise(r => setTimeout(r, 350));
      return { data: {}, error: null };
    },
    onAuthStateChange(callback) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};

export const client = isSupabaseConfigured ? supabase : mockSupabase;
export default client;
