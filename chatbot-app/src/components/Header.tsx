import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { UserIcon, ArrowRightOnRectangleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm dark:bg-dark-700 transition-colors duration-200 border-b border-gray-200 dark:border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/chat" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-bold text-xl transition-colors">
              <ChatBubbleLeftRightIcon className="h-7 w-7" />
              <span className="hidden sm:inline">AI ChatBot</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-800 p-1 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-9 w-9 rounded-full bg-primary-100 dark:bg-dark-600 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-primary-600 dark:text-primary-300" />
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-700 dark:ring-dark-500">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-600">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-dark-600' : ''
                          } w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 flex items-center`}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="btn btn-outline">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary btn-dark">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 