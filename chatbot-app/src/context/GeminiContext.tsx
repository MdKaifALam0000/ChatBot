import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { validateGeminiKey } from '../services/geminiService';
import { getGeminiApiKey } from "../utils/env";

export type GeminiModelType = 'gemini-1.5-flash' | 'gemini-2.0-flash';

interface GeminiContextType {
  apiKey: string;
  isValidKey: boolean;
  isLoading: boolean;
  error: string | null;
  selectedModel: GeminiModelType;
  setApiKey: (key: string) => void;
  setSelectedModel: (model: GeminiModelType) => void;
  validateKey: () => Promise<boolean>;
  resetError: () => void;
}

const defaultValue: GeminiContextType = {
  apiKey: '',
  isValidKey: false,
  isLoading: false,
  error: null,
  selectedModel: 'gemini-2.0-flash',
  setApiKey: () => {},
  setSelectedModel: () => {},
  validateKey: async () => false,
  resetError: () => {},
};

export const GeminiContext = createContext<GeminiContextType>(defaultValue);

interface GeminiProviderProps {
  children: ReactNode;
}

export const useGemini = () => {
  const context = useContext(GeminiContext);
  
  if (!context) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  
  return context;
};

export const GeminiProvider: React.FC<GeminiProviderProps> = ({ children }) => {
  // Use environment variable for API key instead of hardcoding
  const [apiKey, setApiKeyState] = useState<string>(() => {
    // Try to get key from environment variable first, then localStorage
    const envKey = getGeminiApiKey();
    const storedKey = localStorage.getItem('gemini_api_key') || '';
    return envKey || storedKey;
  });
  
  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<GeminiModelType>('gemini-2.0-flash');

  // Validate the API key when it changes
  useEffect(() => {
    if (!apiKey) {
      setIsValidKey(false);
      return;
    }

    const validateApiKey = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const validation = await validateGeminiKey();
        setIsValidKey(validation.isValid);
        
        if (validation.isValid) {
          localStorage.setItem('gemini_api_key', apiKey);
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
    
    validateApiKey();
  }, [apiKey]);

  // Update the API key
  const setApiKey = (key: string) => {
    setApiKeyState(key);
  };

  const resetError = () => {
    setError(null);
  };

  return (
    <GeminiContext.Provider
      value={{
        apiKey,
        isValidKey,
        isLoading,
        error,
        selectedModel,
        setApiKey,
        setSelectedModel,
        validateKey: async () => {
          const result = await validateGeminiKey();
          return result.isValid;
        },
        resetError,
      }}
    >
      {children}
    </GeminiContext.Provider>
  );
}; 