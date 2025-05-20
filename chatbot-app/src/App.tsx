import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { GeminiProvider } from './context/GeminiContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GeminiProvider>
          <div className="min-h-screen bg-gray-50 font-sans transition-colors duration-200 dark:bg-dark-800">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </GeminiProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 