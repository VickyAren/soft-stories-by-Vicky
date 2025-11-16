import React, { createContext, useState, useContext, ReactNode } from 'react';
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

interface DecodedToken {
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  authError: string | null;
  loginWithGoogle: (credential: string) => boolean;
  logout: () => void;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  authError: null,
  loginWithGoogle: () => false,
  logout: () => {},
  isConfigured: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [authError, setAuthError] = useState<string | null>(null);

  const isConfigured = !!ADMIN_EMAIL && !!GOOGLE_CLIENT_ID;

  const loginWithGoogle = (credential: string): boolean => {
    if (!isConfigured) {
      const message = "Admin login is not configured. Please set GOOGLE_CLIENT_ID and ADMIN_EMAIL environment variables.";
      console.error(message);
      setAuthError(message);
      return false;
    }
    
    try {
      const decoded: DecodedToken = jwtDecode(credential);
      if (decoded.email === ADMIN_EMAIL) {
        setIsAuthenticated(true);
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setAuthError(null);
        return true;
      } else {
        setAuthError('Access Denied: This Google account is not authorized for admin access.');
        setIsAuthenticated(false);
        sessionStorage.removeItem('isAdminAuthenticated');
        return false;
      }
    } catch (error) {
      console.error("JWT Decode Error:", error);
      setAuthError('An error occurred during authentication.');
      return false;
    }
  };

  const logout = () => {
    googleLogout();
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAdminAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginWithGoogle, logout, authError, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};