import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DemoInstructionsProps {
  onClose: () => void;
}

const DemoInstructions: React.FC<DemoInstructionsProps> = ({ onClose }) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-dark-700 rounded-xl shadow-2xl max-w-md w-full transition-all duration-200 transform animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Demo Instructions</h2>
            <button 
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              onClick={onClose}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>Welcome to the AI ChatBot demo! This application demonstrates:</p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>User authentication (login/register)</li>
              <li>Real-time chat with an AI assistant (OpenAI integration)</li>
              <li>Dark/light mode theming</li>
              <li>Responsive UI for all devices</li>
            </ul>
            
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Demo Credentials</h3>
              <div className="bg-gray-100 dark:bg-dark-800 p-3 rounded-md font-mono text-sm">
                <p><span className="text-primary-600 dark:text-primary-400">Email:</span> demo@example.com</p>
                <p><span className="text-primary-600 dark:text-primary-400">Password:</span> password123</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Note: This is a demo application. No real data is sent to any server, and the OpenAI integration requires your own API key.
            </p>
          </div>
          
          <div className="mt-6">
            <button 
              className="w-full btn btn-primary btn-dark"
              onClick={onClose}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoInstructions; 