import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border-l-4 border-red-500 dark:border-red-600 rounded-lg p-4 mb-6 shadow-md animate-fadeIn mx-auto max-w-2xl">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-red-100 dark:bg-red-800/30 p-2 rounded-full">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <div className="ml-3 flex-grow">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Error</h3>
          <p className="text-sm text-red-700 dark:text-red-400">{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3 flex-shrink-0">
            <button
              type="button"
              className="inline-flex bg-white/80 dark:bg-dark-800/80 rounded-full p-1.5 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-600 transition-all hover:bg-white dark:hover:bg-dark-700"
              onClick={onDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert; 