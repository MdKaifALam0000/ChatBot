import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import DemoInstructions from '../components/DemoInstructions';
import { useAuth } from '../hooks/useAuth';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { login, isAuthenticated, error, loading } = useAuth();
  const navigate = useNavigate();

  // Show demo instructions on first load
  useEffect(() => {
    setShowInstructions(true);
  }, []);

  // Fill demo credentials when instructions are closed
  const handleCloseInstructions = () => {
    setShowInstructions(false);
    setFormData({
      email: 'demo@example.com',
      password: 'password123',
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setIsSubmitting(false);
    }
  }, [error]);

  const { email, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-800 transition-colors duration-200">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-800 transition-colors duration-200">
      <Header />
      
      <div className="flex flex-col items-center justify-center px-6 py-12 mx-auto lg:py-16">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Welcome to AI ChatBot</h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
            Your intelligent AI assistant
          </p>
        </div>
        
        <div className="w-full bg-white dark:bg-dark-700 rounded-lg shadow-xl dark:shadow-md sm:max-w-md transition-all duration-200">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            
            {errorMessage && (
              <ErrorAlert 
                message={errorMessage} 
                onDismiss={() => setErrorMessage(null)} 
              />
            )}
            
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="input"
                  value={password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn btn-primary btn-dark flex justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" className="py-1" />
                ) : (
                  'Sign in'
                )}
              </button>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowInstructions(true)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View Demo Instructions
                </button>
                <Link to="/register" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>For demo purposes, use:</p>
          <p className="font-mono mt-1">demo@example.com / password123</p>
        </div>
      </div>
      
      {showInstructions && <DemoInstructions onClose={handleCloseInstructions} />}
    </div>
  );
};

export default Login; 