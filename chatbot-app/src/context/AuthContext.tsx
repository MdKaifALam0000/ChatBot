import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

// Demo user for testing
const DEMO_USER = {
  _id: '1234567890',
  username: 'demouser',
  email: 'demo@example.com',
  password: 'password123' // In a real app, never store passwords in plain text
};

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const defaultValue: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
};

export const AuthContext = createContext<AuthContextType>(defaultValue);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API URL (should be set in .env in production)
  const API_URL = 'http://localhost:5000/api';

  // Set auth token for all requests
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  };

  // Load user on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        setAuthToken(token);
        try {
          // Check if token is the demo token
          if (token === 'demo-token-1234567890') {
            setUser({
              _id: DEMO_USER._id,
              username: DEMO_USER.username,
              email: DEMO_USER.email
            });
            setIsAuthenticated(true);
          } else {
            // Try to get user from API
            try {
              const res = await axios.get(`${API_URL}/users/me`);
              setUser(res.data);
              setIsAuthenticated(true);
            } catch (err) {
              // If API request fails, fall back to demo login
              const savedEmail = localStorage.getItem('user_email');
              if (savedEmail === DEMO_USER.email) {
                setUser({
                  _id: DEMO_USER._id,
                  username: DEMO_USER.username,
                  email: DEMO_USER.email
                });
                setIsAuthenticated(true);
              } else {
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
                setAuthToken(null);
              }
            }
          }
        } catch (err) {
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Check for demo credentials
      if (email === DEMO_USER.email && password === DEMO_USER.password) {
        const demoToken = 'demo-token-1234567890';
        setToken(demoToken);
        setAuthToken(demoToken);
        setIsAuthenticated(true);
        setUser({
          _id: DEMO_USER._id,
          username: DEMO_USER.username,
          email: DEMO_USER.email
        });
        localStorage.setItem('user_email', email);
        return;
      }
      
      // Try API login if not demo
      try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        setToken(res.data.token);
        setAuthToken(res.data.token);
        setIsAuthenticated(true);
        setUser(res.data.user);
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthToken(null);
    }
  };

  // Register user
  const register = async (username: string, email: string, password: string) => {
    try {
      setError(null);
      
      // Always allow registration with demo credentials
      if (email === DEMO_USER.email) {
        const demoToken = 'demo-token-1234567890';
        setToken(demoToken);
        setAuthToken(demoToken);
        setIsAuthenticated(true);
        setUser({
          _id: DEMO_USER._id,
          username: username || DEMO_USER.username,
          email: DEMO_USER.email
        });
        localStorage.setItem('user_email', email);
        return;
      }
      
      // Try API registration if not demo
      try {
        const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
        setToken(res.data.token);
        setAuthToken(res.data.token);
        setIsAuthenticated(true);
        setUser(res.data.user);
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthToken(null);
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
    localStorage.removeItem('user_email');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 