
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in with Google');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">Welcome Back!</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M12.545 12.151c0 .866-.699 1.568-1.559 1.568a1.562 1.562 0 0 1 0-3.124c.86-.004 1.559.692 1.559 1.556zm3.44 1.568h-1.876V12.15h1.876v1.568zm5.539-1.568c0 .866-.695 1.568-1.559 1.568a1.562 1.562 0 0 1 0-3.124c.86-.004 1.559.692 1.559 1.556zm-8.979-1.568c0-.864.694-1.564 1.559-1.564a1.562 1.562 0 0 1 0 3.124 1.564 1.564 0 0 1-1.559-1.56z"
                  fill="#4285F4"
                />
                <path
                  d="M6.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
                  fill="#EA4335"
                />
                <path
                  d="M21.75 12c0-5.799-4.701-10.5-10.5-10.5S.75 6.201.75 12s4.701 10.5 10.5 10.5 10.5-4.701 10.5-10.5zm-1.75 0c0 4.823-3.927 8.75-8.75 8.75S2.5 16.823 2.5 12 6.427 3.25 11.25 3.25 20 7.177 20 12z"
                  fill="#4285F4"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
        
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
