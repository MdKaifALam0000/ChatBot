import React, { useState } from 'react';
import { useOpenAI } from '../hooks/useOpenAI';
import { KeyIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import ErrorAlert from './ErrorAlert';
import LoadingSpinner from './LoadingSpinner';

interface OpenAISettingsProps {
  onClose: () => void;
}

const OpenAISettings: React.FC<OpenAISettingsProps> = ({ onClose }) => {
  const { apiKey, isValidKey, isLoading, error, setApiKey, validateKey, resetError } = useOpenAI();
  const [key, setKey] = useState(apiKey);
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSave = async () => {
    if (key === apiKey && isValidKey) {
      onClose();
      return;
    }

    setIsSaving(true);
    setApiKey(key);
    const isValid = await validateKey();
    setIsSaving(false);
    
    if (isValid) {
      onClose();
    }
  };

  // Mask API key for display
  const displayKey = (key: string) => {
    if (!key) return '';
    if (showKey) return key;
    // Only show first 3 and last 4 characters
    return key.length > 7 
      ? `${key.substring(0, 3)}...${key.substring(key.length - 4)}`
      : '•'.repeat(key.length); // For very short keys, just use dots
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-dark-700 rounded-lg shadow-xl p-6 max-w-md w-full transition-all duration-200">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <KeyIcon className="h-5 w-5 text-primary-500" />
          OpenAI API Settings
        </h2>
        
        {error && (
          <ErrorAlert 
            message={error} 
            onDismiss={resetError} 
          />
        )}
        
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="apiKey" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                id="apiKey"
                className="input pr-24"
                placeholder="sk-..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isValidKey ? (
                <span className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Valid API key
                </span>
              ) : apiKey ? (
                <span className="flex items-center text-red-600 dark:text-red-400">
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Invalid API key
                </span>
              ) : (
                "Enter your OpenAI API key to use GPT"
              )}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-dark-600 p-3 rounded-md text-sm text-gray-700 dark:text-gray-300">
            <p>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">OpenAI's platform</a>.</p>
            <p className="mt-1">Your API key is stored locally in your browser and never sent to our servers.</p>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving || isLoading || !key}
          >
            {isSaving || isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              'Save Key'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenAISettings; 