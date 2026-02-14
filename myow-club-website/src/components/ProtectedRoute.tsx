import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { isConfigured, auth } from '../firebase';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Firebase Not Configured</h1>
        <p className="text-gray-600 max-w-md">
          Please update <code>src/firebase.ts</code> with your project keys to enable the Admin Dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
