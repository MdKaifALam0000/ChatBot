/**
 * Environment variable utility functions
 * 
 * This file centralizes access to environment variables and provides
 * helper functions to safely access them.
 */

/**
 * Get an environment variable value
 * @param key The environment variable key
 * @param defaultValue Optional default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export const getEnv = (key: string, defaultValue: string = ''): string => {
  const value = process.env[key];
  return value !== undefined ? value : defaultValue;
};

/**
 * Get the Google Gemini API key
 * @returns The Google Gemini API key
 */
export const getGeminiApiKey = (): string => {
  return getEnv('REACT_APP_GOOGLE_API_KEY');
};

/**
 * Get the API URL
 * @returns The API URL
 */
export const getApiUrl = (): string => {
  return getEnv('REACT_APP_API_URL', 'http://localhost:5000/api');
};

/**
 * Get the Socket.IO URL
 * @returns The Socket.IO URL
 */
export const getSocketUrl = (): string => {
  return getEnv('REACT_APP_SOCKET_URL', 'http://localhost:5000');
};

/**
 * Check if we're in development mode
 * @returns True if we're in development mode
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Check if we're in production mode
 * @returns True if we're in production mode
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
}; 