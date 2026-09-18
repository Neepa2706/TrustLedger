import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = useCallback(async (email, password, rememberMe) => {
    setLoading(true);
    setAuthError(null);
    try {
      const session = await authService.login(email, password, rememberMe);
      setUser(session);
      return session;
    } catch (err) {
      const friendlyMessage = err.message || 'Unable to sign in. Please check your credentials and try again.';
      setAuthError(friendlyMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginDemo = useCallback(async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const session = await authService.startDemoSession();
      setUser(session);
      return session;
    } catch {
      const friendlyMessage = 'Demo access could not be started. Please try again.';
      setAuthError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setAuthError(null);
  }, []);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isDemo: Boolean(user?.isDemo),
    loading,
    authError,
    login,
    loginDemo,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
