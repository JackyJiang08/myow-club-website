import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isRealConfigured } from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    
    const allowedEmails = ['jiangyuqing0508@gmail.com', 'jw151@illinois.edu'];
    
    // In a real app, this validation should happen on the server/backend
    if (allowedEmails.includes(trimmedEmail)) {
      // Simulate auth session in localStorage
      localStorage.setItem('adminUserEmail', trimmedEmail);
      localStorage.setItem('adminAuthToken', 'mock-token-' + Date.now());
      navigate('/admin');
    } else {
      setError('Access Denied: This email is not authorized for leadership access.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-100">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border border-gray-200">
           <img 
             src="/logo.png" 
             alt="MYOW Logo" 
             className="w-full h-full object-cover transform scale-150 translate-y-2"
           />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Staff Login</h1>
        <p className="text-gray-600 mb-8 whitespace-nowrap">Enter your email to access the admin dashboard.</p>
        
        {!isRealConfigured && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6 text-sm">
            <strong>Demo Mode:</strong> Firebase is not configured, but you can still log in to test the UI. Data will be saved to your browser's local storage.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full font-bold py-3 px-4 rounded-lg transition-colors shadow-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Enter Dashboard
          </button>
        </form>
        
        <p className="mt-6 text-xs text-gray-500">
          Restricted access for MYOW Leadership Team only.
        </p>
      </div>
    </div>
  );
};

export default Login;
