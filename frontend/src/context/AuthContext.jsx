import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial check to see if user is authenticated (via profile fetch)
  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data && response.data.success) {
        const profileData = response.data.profile;
        setProfile(profileData);
        if (profileData.userId) {
          setUser({
            _id: profileData.userId._id,
            email: profileData.userId.email,
            isHost: profileData.userId.isHost,
          });
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      // Not authenticated or session expired
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    // Bind global auth failure handler (used by axios client when refresh fails)
    window.handleAuthFailure = () => {
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    };

    return () => {
      window.handleAuthFailure = null;
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      await api.post('/auth/login', { email, password });
      // Fetch profile to populate user details
      const response = await api.get('/profile');
      const profileData = response.data.profile;
      setProfile(profileData);
      setUser({
        _id: profileData.userId._id,
        email: profileData.userId.email,
        isHost: profileData.userId.isHost,
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    try {
      await api.post('/auth/signup', { email, password });
      // After signup, we log in the user immediately
      return await login(email, password);
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const becomeHost = async () => {
    try {
      const response = await api.patch('/users/become-host');
      if (response.data && response.data.success) {
        // Refresh profile / user details
        await checkAuthStatus();
        return { success: true, message: response.data.message };
      }
      return { success: false, error: response.data?.message || 'Failed to become host' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to become host';
      return { success: false, error: message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      if (response.data && response.data.success) {
        const updatedProfile = response.data.profile;
        setProfile(updatedProfile);
        setUser({
          _id: updatedProfile.userId._id,
          email: updatedProfile.userId.email,
          isHost: updatedProfile.userId.isHost,
        });
        return { success: true };
      }
      return { success: false, error: 'Failed to update profile' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    profile,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    becomeHost,
    updateProfile,
    refreshUser: checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
