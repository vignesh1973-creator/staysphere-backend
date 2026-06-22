import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(modeParam !== 'signup');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the URL query param changes, update the mode
    setIsLogin(modeParam !== 'signup');
    setValidationError('');
    setApiError('');
  }, [modeParam]);

  useEffect(() => {
    // If already logged in, redirect home
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setApiError('');

    // Client-side validations
    if (!email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    setLoading(true);
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await signup(email, password);
    }
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex bg-brand-600/10 text-brand-655 text-brand-600 dark:text-brand-400 p-3 rounded-2xl mb-4 border border-brand-500/20">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            {isLogin ? 'Sign in to access your bookings' : 'Join StaySphere to start exploring'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-200/50 dark:bg-slate-950 p-1.5 rounded-xl mb-6 border border-slate-300 dark:border-slate-800">
          <button
            onClick={() => {
              setIsLogin(true);
              navigate('/auth?mode=login');
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              isLogin 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              navigate('/auth?mode=signup');
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              !isLogin 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Validation or API Errors */}
        {(validationError || apiError) && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-955/40 bg-red-950/40 border border-red-200 dark:border-red-500/30 rounded-xl text-red-655 text-red-600 dark:text-red-400 text-sm font-medium leading-relaxed">
            {validationError || apiError}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-brand-500/80 focus:ring-1 focus:ring-brand-500/30 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl py-3 pl-11 pr-11 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-brand-500/80 focus:ring-1 focus:ring-brand-500/30 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-brand-500/80 focus:ring-1 focus:ring-brand-500/30 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary mt-6 py-3"
          >
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Please wait...
              </>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
