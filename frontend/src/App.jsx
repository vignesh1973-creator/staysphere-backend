import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ListingDetail from './pages/ListingDetail';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import HostDashboard from './pages/HostDashboard';
import { RefreshCw } from 'lucide-react';

// Route Guard for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <RefreshCw className="h-10 w-10 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Authenticating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Root App Content with Navbar and Layout
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-955/20 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <RefreshCw className="h-10 w-10 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Checking authentication state...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/listings/:id" element={<ListingDetail />} />

          {/* Protected Guest / User Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } 
          />

          {/* Protected Host Routes */}
          <Route 
            path="/host-dashboard" 
            element={
              <ProtectedRoute>
                <HostDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-slate-100 dark:bg-slate-950 py-6 text-center text-xs text-slate-500 dark:text-slate-600 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} StaySphere Inc. All rights reserved.</p>
         
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
