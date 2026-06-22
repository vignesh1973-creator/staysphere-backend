import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, User, LogOut, Compass, Calendar, 
  LayoutDashboard, UserCheck, ShieldAlert, Home,
  Sun, Moon
} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, becomeHost } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);
  const [hostLoading, setHostLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    setIsOpen(false);
    navigate('/');
  };

  const handleBecomeHost = async () => {
    setHostLoading(true);
    const res = await becomeHost();
    setHostLoading(false);
    setShowBecomeHostModal(false);
    if (res.success) {
      navigate('/host-dashboard');
    } else {
      alert(res.error);
    }
    setShowDropdown(false);
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200/60 dark:border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity">
              <div className="bg-brand-600 p-2 rounded-xl text-white">
                <Home className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">
                <span className="text-slate-900 dark:text-white">Stay</span>
                <span className="text-brand-600 dark:text-brand-400">Sphere</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-950/40' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="h-4 w-4" />
              Explore
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-300 dark:border-slate-800 transition-all active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-yellow-500" /> : <Moon className="h-4.5 w-4.5 text-indigo-500" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/bookings" 
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/bookings') ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-950/40' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  My Bookings
                </Link>

                {user?.isHost ? (
                  <Link 
                    to="/host-dashboard" 
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/host-dashboard') ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-950/40' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Host Dashboard
                  </Link>
                ) : (
                  <button 
                    onClick={() => setShowBecomeHostModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600/20 hover:bg-brand-600/30 text-brand-600 dark:text-brand-300 text-xs font-semibold rounded-lg border border-brand-500/30 transition-all active:scale-95"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Become a Host
                  </button>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/60 p-1.5 px-3 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <div className="bg-brand-500/20 text-brand-600 dark:text-brand-300 rounded-full p-1">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold max-w-[120px] truncate">{user?.email}</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-slate-900 border border-slate-200 py-1 focus:outline-none">
                      <Link 
                        to="/profile" 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium px-3 py-2 transition-colors">
                  Sign In
                </Link>
                <Link to="/auth?mode=signup" className="btn-primary py-1.5 px-4 rounded-lg text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-300 dark:border-slate-800 transition-all active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-yellow-500" /> : <Moon className="h-4.5 w-4.5 text-indigo-500" />}
            </button>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200/60 dark:border-slate-800/80 px-2 pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
              isActive('/') ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-950/40' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="h-5 w-5" />
            Explore Stays
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/bookings" 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive('/bookings') ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-950/40' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="h-5 w-5" />
                My Bookings
              </Link>

              {user?.isHost ? (
                <Link 
                  to="/host-dashboard" 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive('/host-dashboard') ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-950/40' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Host Dashboard
                </Link>
              ) : (
                <button 
                  onClick={() => setShowBecomeHostModal(true)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-brand-600 dark:text-brand-300 font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <UserCheck className="h-5 w-5" />
                  Become a Host
                </button>
              )}

              <Link 
                to="/profile" 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive('/profile') ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-950/40' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="h-5 w-5" />
                My Profile ({user?.email})
              </Link>

              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-red-500 dark:text-red-400 font-medium transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-800 mt-2 flex flex-col gap-2 px-3">
              <Link to="/auth" onClick={() => setIsOpen(false)} className="text-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-base font-medium py-2 transition-colors">
                Sign In
              </Link>
              <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)} className="btn-primary text-center py-2.5">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
      <ConfirmationModal
        isOpen={showBecomeHostModal}
        onClose={() => setShowBecomeHostModal(false)}
        onConfirm={handleBecomeHost}
        title="Become a Property Host"
        message="Are you sure you want to become a host? This will grant you access to the Host Console where you can create and manage your property listings."
        confirmText="Become Host"
        cancelText="Maybe Later"
        loading={hostLoading}
        type="info"
      />
    </nav>
  );
};

export default Navbar;
