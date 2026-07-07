import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const API_BASE_URL = 'http://localhost:5131';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialise auth from localStorage
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    const savedRole = localStorage.getItem('role');

    if (savedToken && savedUsername && savedRole) {
      setToken(savedToken);
      setUser({ username: savedUsername, role: savedRole });
    }
    setLoading(false);
  }, []);

  const parseErrorMessage = (errorData, defaultMessage) => {
    if (!errorData) return defaultMessage;
    if (errorData.message) return errorData.message;

    // If standard ASP.NET Core Validation Problem Details
    if (errorData.errors && typeof errorData.errors === 'object') {
      const errorList = Object.values(errorData.errors).flat();
      if (errorList.length > 0) return errorList.join(' ');
    }

    // If it's a direct dictionary of field errors (e.g. ModelState direct serialization)
    if (typeof errorData === 'object' && !Array.isArray(errorData)) {
      const errorList = Object.values(errorData).flat().filter(item => typeof item === 'string');
      if (errorList.length > 0) return errorList.join(' ');
    }

    return defaultMessage;
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseErrorMessage(errorData, 'Login failed. Please check credentials.'));
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);

      setToken(data.token);
      setUser({ username: data.username, role: data.role });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (username, password, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(parseErrorMessage(errorData, 'Sign up failed.'));
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);

      setToken(data.token);
      setUser({ username: data.username, role: data.role });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    
    setToken(null);
    setUser(null);
  };

  // Helper fetcher that appends Bearer Authorization
  const fetchWithAuth = async (endpoint, options = {}) => {
    const currentToken = token || localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
