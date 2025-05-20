import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let isDemo = false;
let messageCallbacks: Array<(message: any) => void> = [];

// Connect to the socket server
export const connectSocket = (token: string): Socket | null => {
  // Check if this is a demo token
  if (token === 'demo-token-1234567890') {
    isDemo = true;
    console.log('Connected to demo socket');
    return null;
  }
  
  try {
    if (!socket) {
      socket = io('http://localhost:5000', {
        auth: {
          token
        }
      });
    }
    return socket;
  } catch (error) {
    console.error('Socket connection error:', error);
    isDemo = true; // Fall back to demo mode
    return null;
  }
};

// Disconnect from the socket server
export const disconnectSocket = (): void => {
  if (isDemo) {
    isDemo = false;
    messageCallbacks = [];
    console.log('Disconnected from demo socket');
    return;
  }
  
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Get the socket instance
export const getSocket = (): Socket | null => {
  return socket;
};

// Join a chat room
export const joinRoom = (roomId: string): void => {
  if (isDemo) {
    console.log(`Demo: Joined room ${roomId}`);
    return;
  }
  
  if (socket) {
    socket.emit('join_room', roomId);
  }
};

// Send a message to the chatbot
export const sendMessage = (message: string): void => {
  if (isDemo) {
    console.log(`Demo: Sent message - ${message}`);
    return;
  }
  
  if (socket) {
    socket.emit('send_message', { content: message, timestamp: new Date() });
  }
};

// Listen for incoming messages
export const onReceiveMessage = (callback: (message: any) => void): void => {
  if (isDemo) {
    // Store callback for demo mode
    messageCallbacks.push(callback);
    return;
  }
  
  if (socket) {
    socket.on('receive_message', callback);
  }
};

// Remove event listener
export const offReceiveMessage = (): void => {
  if (isDemo) {
    messageCallbacks = [];
    return;
  }
  
  if (socket) {
    socket.off('receive_message');
  }
};

// For demo mode - trigger callbacks with a message
export const triggerDemoMessage = (message: any): void => {
  if (isDemo) {
    messageCallbacks.forEach(callback => callback(message));
  }
}; 