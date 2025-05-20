import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`toggle-switch ${theme === 'dark' ? 'toggle-switch-active' : 'toggle-switch-inactive'} ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="sr-only">Toggle dark mode</span>
      <span className="toggle-switch-circle flex items-center justify-center">
        {theme === 'dark' ? (
          <MoonIcon className="h-3 w-3 text-primary-500" />
        ) : (
          <SunIcon className="h-3 w-3 text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle; 