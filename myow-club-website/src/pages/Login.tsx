import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, isConfigured } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { PenTool } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    if (!isConfigured) {
      alert("Firebase is not configured yet! Check console for details.");
      return;
    }
    
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/admin');
    } catch (error) {
      console.error("Error signing in with Google", error);
      alert("Failed to sign in. Please check the console for details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-100">
        <div className="bg-indigo-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <PenTool className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Staff Login</h1>
        <p className="text-gray-600 mb-8">Sign in to manage club activities and announcements.</p>
        
        {!isConfigured && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6 text-sm">
            <strong>Setup Required:</strong> Please configure Firebase in <code>src/firebase.ts</code> to enable login.
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={!isConfigured}
          className={`w-full flex items-center justify-center gap-3 border border-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm
            ${!isConfigured 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className={`w-5 h-5 ${!isConfigured ? 'opacity-50' : ''}`} />
          Sign in with Google
        </button>
        
        <p className="mt-6 text-xs text-gray-500">
          Only authorized staff members can access the admin dashboard.
        </p>
      </div>
    </div>
  );
};

export default Login;
