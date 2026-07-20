import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getUser());
  
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(authService.getUser());
    };
    
    // Listen for cross-tab storage changes
    window.addEventListener('storage', handleStorageChange);
    // Listen for same-tab auth changes dispatched by AuthService
    window.addEventListener('authStateChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleStorageChange);
    };
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully.');
    window.location.href = '/login';
  };

  const updateRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success(`Role switched to ${newRole}`);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    logout,
    updateRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
