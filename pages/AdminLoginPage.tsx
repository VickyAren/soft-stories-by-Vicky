import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, authError, isConfigured } = useAuth();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      if (loginWithGoogle(credentialResponse.credential)) {
        navigate('/admin/dashboard');
      }
    } else {
      console.error("Login failed: No credential returned from Google.");
    }
  };

  const handleError = () => {
    console.error("Google Login Error");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Admin Login</h1>
        
        <div className="flex justify-center my-4">
          {isConfigured ? (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
            />
          ) : (
            <div className="text-center p-4 border border-red-300 bg-red-50 text-red-700 rounded-lg">
              <p className="font-semibold">Login Not Configured</p>
              <p className="text-sm mt-1">
                Please set the <code className="bg-red-100 px-1 rounded">GOOGLE_CLIENT_ID</code> and <code className="bg-red-100 px-1 rounded">ADMIN_EMAIL</code> environment variables.
              </p>
            </div>
          )}
        </div>

        {authError && (
            <p className="text-red-500 text-sm text-center my-4 p-2 bg-red-50 rounded-md">{authError}</p>
        )}
        
        <div className="text-center mt-6">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              ← Go to website
            </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;