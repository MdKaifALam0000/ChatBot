import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { validateOpenAIKey } from '../services/openaiService';

interface OpenAIContextType {
  apiKey: string;
  isValidKey: boolean;
  isLoading: boolean;
  error: string | null;
  setApiKey: (key: string) => void;
  validateKey: () => Promise<boolean>;
  resetError: () => void;
}

const defaultValue: OpenAIContextType = {
  apiKey: '',
  isValidKey: false,
  isLoading: false,
  error: null,
  setApiKey: () => {},
  validateKey: async () => false,
  resetError: () => {},
};

export const OpenAIContext = createContext<OpenAIContextType>(defaultValue);

interface OpenAIProviderProps {
  children: ReactNode;
}

export const OpenAIProvider: React.FC<OpenAIProviderProps> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    // Try to get key from environment variables first, then localStorage
    const envKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    const storedKey = localStorage.getItem('openai_api_key') || '';
    return envKey || storedKey;
  });
  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Validate API key when it changes
  useEffect(() => {
    const validateAPIKey = async () => {
      if (!apiKey) {
        setIsValidKey(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const validation = await validateOpenAIKey(apiKey);
        setIsValidKey(validation.isValid);
        
        if (validation.isValid) {
          localStorage.setItem('openai_api_key', apiKey);
        } else {
          setError(validation.errorMessage || 'Invalid API key. Please check and try again.');
        }
      } catch (err) {
        setError('Error validating API key. Please try again later.');
        setIsValidKey(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (apiKey) {
      validateAPIKey();
    }
  }, [apiKey]);

  const validateKey = async (): Promise<boolean> => {
    if (!apiKey) {
      setError('Please enter an API key');
      return false;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const validation = await validateOpenAIKey(apiKey);
      setIsValidKey(validation.isValid);
      
      if (validation.isValid) {
        localStorage.setItem('openai_api_key', apiKey);
        return true;
      } else {
        setError(validation.errorMessage || 'Invalid API key. Please check and try again.');
        return false;
      }
    } catch (err) {
      setError('Error validating API key. Please try again later.');
      setIsValidKey(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return (
    <OpenAIContext.Provider
      value={{
        apiKey,
        isValidKey,
        isLoading,
        error,
        setApiKey,
        validateKey,
        resetError,
      }}
    >
      {children}
    </OpenAIContext.Provider>
  );
}; 