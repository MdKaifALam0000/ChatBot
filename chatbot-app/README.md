# Chatbot Frontend Application

A real-time chatbot application built with React, TypeScript, and Tailwind CSS that seamlessly connects to a backend API and Socket.IO server.

## Features

- User authentication (Register/Login)
- Real-time chat with an AI assistant
- Realistic typing animation for AI responses
- Modern and responsive UI with Tailwind CSS
- WebSocket connection for instant messaging
- Chat history persistence

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Backend API and Socket.IO server running on http://localhost:5000
- Google Gemini API key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chatbot-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# API Keys (replace with your actual keys)
REACT_APP_GOOGLE_API_KEY=your_google_api_key_here
```

> **IMPORTANT**: Never commit your `.env` file to version control. The file is included in `.gitignore` by default.

## Running the App

1. Start the development server:
```bash
npm start
```

2. Build for production:
```bash
npm run build
```

## Project Structure

```
chatbot-app/
├── public/                 # Static files
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API and socket services
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   └── index.tsx           # Entry point
├── package.json            # Dependencies and scripts
└── tailwind.config.js      # Tailwind CSS configuration
```

## Backend Setup

This frontend application expects a backend server with the following endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login existing user
- `GET /api/users/me` - Get current user profile
- `GET /api/messages/history` - Get chat history

The backend should also implement Socket.IO events:
- `join_room` - Join a chat room
- `send_message` - Send a message
- `receive_message` - Receive a message

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- Socket.IO Client
- Axios for HTTP requests
- React Router for navigation
- Heroicons and Headless UI for components