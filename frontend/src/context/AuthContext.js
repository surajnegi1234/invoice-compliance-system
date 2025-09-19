import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState('default');



  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Get tenant from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const tenantParam = urlParams.get('tenant') || 'default';
      setTenant(tenantParam);

      const response = await api.get(`/api/auth/profile?tenant=${tenantParam}`);
      
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      // Not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post(`/api/auth/login?tenant=${tenant}`, {
        email,
        password
      });

      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post(`/api/auth/logout?tenant=${tenant}`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Redirect to login
      window.location.href = '/';
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    tenant
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};