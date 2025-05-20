import axios from 'axios';

// API URL (should be in .env file in production)
const API_URL = 'http://localhost:5000/api';

// Demo message history
const DEMO_HISTORY = [
  {
    _id: '1',
    content: 'Hello! Welcome to the chatbot application.',
    isUser: false,
    timestamp: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    _id: '2',
    content: 'How can I help you today?',
    isUser: false,
    timestamp: new Date(Date.now() - 86400000 + 30000) // 1 day ago + 30 seconds
  },
  {
    _id: '3',
    content: 'I\'d like to know more about your services.',
    isUser: true,
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    _id: '4',
    content: 'We offer a variety of AI-powered chat solutions for businesses and individuals. Our services include customer support automation, virtual assistants, and conversational AI interfaces.',
    isUser: false,
    timestamp: new Date(Date.now() - 3600000 + 10000) // 1 hour ago + 10 seconds
  }
];

// Check if a token is a demo token
const isDemoToken = (token: string): boolean => {
  return token === 'demo-token-1234567890';
};

// Get chat history
export const getChatHistory = async (token: string) => {
  if (isDemoToken(token)) {
    // Return demo data with a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    return DEMO_HISTORY;
  }
  
  try {
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    const response = await axios.get(`${API_URL}/messages/history`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    // Fall back to demo data if request fails
    return DEMO_HISTORY;
  }
};

// Get user profile
export const getUserProfile = async (token: string) => {
  if (isDemoToken(token)) {
    // Return demo data with a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      _id: '1234567890',
      username: 'demouser',
      email: 'demo@example.com'
    };
  }
  
  try {
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    const response = await axios.get(`${API_URL}/users/me`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (token: string, userData: any) => {
  if (isDemoToken(token)) {
    // Return demo data with a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      ...userData,
      _id: '1234567890'
    };
  }
  
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
    const response = await axios.put(`${API_URL}/users/me`, userData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 