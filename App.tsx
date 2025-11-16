import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BooksPage from './pages/BooksPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.warn("Configuration Warning: GOOGLE_CLIENT_ID environment variable is not set. Admin login via Google will be disabled.");
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <DataProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </HashRouter>
        </DataProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}