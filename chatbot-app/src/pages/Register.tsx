import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { UserPlusIcon } from '@heroicons/react/24/solid';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isAuthenticated, error, loading } = useAuth();
  const navigate = useNavigate();

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

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    
    try {
      await register(name, email, password);
    } catch (error) {
      console.error('Registration error:', error);
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
            <UserPlusIcon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Create your account</h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
            Join the AI conversation
          </p>
        </div>
        
        <div className="w-full bg-white dark:bg-dark-700 rounded-lg shadow-xl dark:shadow-md sm:max-w-md transition-all duration-200">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Register a new account
            </h2>
            
            {errorMessage && (
              <ErrorAlert 
                message={errorMessage} 
                onDismiss={() => setErrorMessage(null)} 
              />
            )}
            
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="input"
                  placeholder="Your name"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </div>
              
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
              
              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="input"
                  value={confirmPassword}
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
                  'Create Account'
                )}
              </button>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 