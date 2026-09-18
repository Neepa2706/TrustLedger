/**
 * TrustLedger UserAuthContext
 * Manages customer/borrower authentication, Supabase Google OAuth,
 * profile data persistence, single-person account isolation,
 * and verification state transitions.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import supabase, { isSupabaseConfigured } from '../services/supabaseClient';
import userProfileService from '../services/userProfileService';

const USER_SESSION_KEY = 'trustledger_borrower_session';

export const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Load profile whenever user session changes
  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      userProfileService.getProfile(user.id).then((p) => {
        if (isMounted && p) setProfile(p);
      }).catch(() => {});
    } else {
      setProfile(null);
    }
    return () => { isMounted = false; };
  }, [user?.id]);

  /**
   * Borrower Email & Password Login
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      if (!email || !email.trim()) {
        throw new Error('Please enter your email.');
      }
      if (!password) {
        throw new Error('Please enter your password.');
      }

      let authUser = null;

      if (isSupabaseConfigured && supabase?.auth?.signInWithPassword) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });
        if (error) {
          throw new Error('Email or password is incorrect.');
        }
        authUser = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          isDemo: false
        };
      } else {
        // Transparent DEMO MODE fallback
        await new Promise(r => setTimeout(r, 400));
        if (password.length < 6) {
          throw new Error('Email or password is incorrect.');
        }
        let demoId = `usr_${Math.random().toString(36).substring(2, 9)}`;
        let demoName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (email.toLowerCase().includes('demo') || email.toLowerCase().includes('arjun')) {
          demoId = 'usr_demo_arjun';
          demoName = 'Arjun Kumar';
        }
        authUser = {
          id: demoId,
          email: email.trim().toLowerCase(),
          fullName: demoName,
          isDemo: true
        };
      }

      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(authUser));
      setUser(authUser);

      const p = await userProfileService.getProfile(authUser.id);
      setProfile(p);
      return authUser;
    } catch (err) {
      const msg = err.message || 'Email or password is incorrect.';
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Google OAuth Sign-In (Minimal scopes: email, profile)
   */
  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setAuthError(null);
    try {
      if (isSupabaseConfigured && supabase?.auth?.signInWithOAuth) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            scopes: 'email profile',
            redirectTo: `${window.location.origin}/profile-setup`
          }
        });
        if (error) {
          throw new Error('Google sign-in could not be completed. Please try again.');
        }
      } else {
        // Seamless DEMO MODE simulation
        await new Promise(r => setTimeout(r, 600));
        const authUser = {
          id: `usr_google_${Math.random().toString(36).substring(2, 8)}`,
          email: 'priya.sharma@example.in',
          fullName: 'Priya Sharma',
          mobile: '9876543210',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          isGoogle: true,
          isDemo: true
        };

        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(authUser));
        setUser(authUser);

        // Pre-seed matching profile
        const initialProfile = {
          user_id: authUser.id,
          full_name: authUser.fullName,
          email: authUser.email,
          mobile: authUser.mobile,
          completion_percentage: 20,
          profile_status: 'IN_PROGRESS',
          verification_status: 'PENDING'
        };
        const p = await userProfileService.updateProfile(initialProfile, authUser.id);
        setProfile(p);
        return authUser;
      }
    } catch (err) {
      const msg = err.message || 'Google sign-in could not be completed. Please try again.';
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Borrower Account Registration
   */
  const register = useCallback(async (formData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { fullName, email, mobile, password, confirmPassword } = formData;

      if (!fullName || fullName.trim().length < 2) {
        throw new Error('Please enter your full legal name.');
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address.');
      }
      const cleanMobile = (mobile || '').replace(/\D/g, '');
      if (cleanMobile.length < 10) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match. Please re-enter.');
      }

      let authUser = null;

      if (isSupabaseConfigured && supabase?.auth?.signUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              mobile: cleanMobile
            }
          }
        });
        if (error) {
          throw new Error('Your account could not be created. Please try again.');
        }
        authUser = {
          id: data.user.id,
          email: data.user.email,
          fullName: fullName.trim(),
          mobile: cleanMobile,
          isDemo: false
        };
      } else {
        // DEMO MODE registration
        await new Promise(r => setTimeout(r, 500));
        authUser = {
          id: `usr_${Math.random().toString(36).substring(2, 9)}`,
          email: email.trim().toLowerCase(),
          fullName: fullName.trim(),
          mobile: cleanMobile,
          isDemo: true
        };
      }

      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(authUser));
      setUser(authUser);

      // Initialize profile record with entered details
      const initialProfile = {
        user_id: authUser.id,
        full_name: fullName.trim(),
        email: authUser.email,
        mobile: cleanMobile,
        completion_percentage: 20,
        profile_status: 'IN_PROGRESS',
        verification_status: 'PENDING'
      };

      const p = await userProfileService.updateProfile(initialProfile, authUser.id);
      setProfile(p);
      return authUser;
    } catch (err) {
      const msg = err.message || 'Your account could not be created. Please try again.';
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update Profile
   */
  const updateProfile = useCallback(async (data) => {
    if (!user?.id) throw new Error('Not authenticated');
    const updated = await userProfileService.updateProfile(data, user.id);
    setProfile(updated);
    return updated;
  }, [user?.id]);

  /**
   * Upload Document
   */
  const uploadDocument = useCallback(async (file) => {
    if (!user?.id) throw new Error('Not authenticated');
    const res = await userProfileService.uploadDocument(file, user.id);
    const p = await userProfileService.getProfile(user.id);
    setProfile(p);
    return res;
  }, [user?.id]);

  /**
   * Upload Camera Photo
   */
  const uploadPhoto = useCallback(async (photoBlob) => {
    if (!user?.id) throw new Error('Not authenticated');
    const res = await userProfileService.uploadPhoto(photoBlob, user.id);
    const p = await userProfileService.getProfile(user.id);
    setProfile(p);
    return res;
  }, [user?.id]);

  /**
   * Cross-Verification
   */
  const verifyIdentity = useCallback(async (isDemo = false) => {
    if (!user?.id) throw new Error('Not authenticated');
    const res = await userProfileService.verifyProfile(isDemo, user.id);
    const p = await userProfileService.getProfile(user.id);
    setProfile(p);
    return res;
  }, [user?.id]);

  /**
   * Sign Out
   */
  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase?.auth?.signOut) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(USER_SESSION_KEY);
    setUser(null);
    setProfile(null);
    setAuthError(null);
  }, []);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = {
    user,
    profile,
    isAuthenticated: Boolean(user),
    isDemo: Boolean(user?.isDemo || !isSupabaseConfigured),
    isSupabaseConfigured,
    loading,
    authError,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    uploadDocument,
    uploadPhoto,
    verifyIdentity,
    clearError
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}

export default UserAuthContext;
