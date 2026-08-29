import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Configure axios authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Validate session on load
  useEffect(() => {
    const checkSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/profile');
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session check failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.data.token);
        setUser(res.data.data.user);
        return res.data.data.user;
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/signup', { name, email, password });
      if (res.data.success) {
        setToken(res.data.data.token);
        setUser(res.data.data.user);
        return res.data.data.user;
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const setAuthData = ({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      if (res.data.success) {
        setUser(prev => ({ ...prev, profile: res.data.data }));
        return res.data.data;
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, setAuthData, updateProfile, isAdmin: user?.role === 'Administrator' }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
