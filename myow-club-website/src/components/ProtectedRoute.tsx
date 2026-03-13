import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isConfigured } from '../firebase';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for our mock auth token
    const token = localStorage.getItem('adminAuthToken');
    const email = localStorage.getItem('adminUserEmail');

    const allowedEmails = ['jiangyuqing0508@gmail.com', 'jw151@illinois.edu'];

    if (token && email && allowedEmails.includes(email)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  // Removed the !isConfigured check here because we want to allow access in Demo Mode

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Check if user is logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
