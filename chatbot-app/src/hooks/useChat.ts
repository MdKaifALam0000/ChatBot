import { useState, useCallback, useRef } from 'react';
import { generateGemini2FlashResponse, generateGeminiVisionResponse } from '../services/geminiService';
import { useGemini } from '../context/GeminiContext';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Character typing speed in milliseconds
const TYPING_SPEED = 2; // Even faster typing speed for smoother animation
const CHUNK_SIZE_LARGE = 8; // Process more characters at once for very long messages
const CHUNK_SIZE_MEDIUM = 5; // Process more characters at once for medium messages
const CHUNK_SIZE_SMALL = 2; // Process more characters at once for short messages

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedModel } = useGemini();
  const messageQueue = useRef<string | null>(null);
  const currentMessageRef = useRef<{id: string, content: string} | null>(null);

  // Function to simulate typing animation
  const typeMessage = useCallback((fullResponse: string) => {
    // Create an AI message with empty content initially
    const aiMessageId = Date.now().toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: '', // Start with empty content
      isUser: false,
      timestamp: new Date()
    };
    
    // Add the empty AI message to the messages array
    setMessages(prev => [...prev, aiMessage]);
    
    // Set typing state to true to show typing indicator while generating the response
    setIsTyping(true);
    currentMessageRef.current = { id: aiMessageId, content: '' };
    
    let index = 0;
    const responseLength = fullResponse.length;
    
    // Function to add characters in chunks for smoother appearance
    const typeCharacter = () => {
      if (index < responseLength) {
        // Get the next chunk of characters - process more characters at once for longer messages
        const chunkSize = responseLength > 1000 ? CHUNK_SIZE_LARGE : 
                         responseLength > 500 ? CHUNK_SIZE_MEDIUM : CHUNK_SIZE_SMALL;
        const endIndex = Math.min(index + chunkSize, responseLength);
        
        // Get the next chunk of characters
        const nextChunk = fullResponse.substring(index, endIndex);
        const lastChar = nextChunk[nextChunk.length - 1];
        index = endIndex;
        
        // Update the message content with the next chunk
        currentMessageRef.current = {
          id: aiMessageId,
          content: fullResponse.substring(0, index)
        };
        
        // Update the message in the messages array with requestAnimationFrame for smoother rendering
        const currentContent = fullResponse.substring(0, index);
        requestAnimationFrame(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: currentContent } 
                : msg
            )
          );
        });
        
        // Adjust typing speed based on character and chunk position
        // Slow down at punctuation but keep overall speed faster
        const isPunctuationChar = isPunctuation(lastChar);
        const isNewLine = lastChar === '\n';
        const delay = isNewLine ? TYPING_SPEED * 5 : 
                     isPunctuationChar ? TYPING_SPEED * 2 : 
                     TYPING_SPEED;
        
        // Schedule the next character with requestAnimationFrame for smoother animation
        setTimeout(() => {
          requestAnimationFrame(typeCharacter);
        }, delay);
      } else {
        // Typing complete
        setIsTyping(false);
        currentMessageRef.current = null;
        
        // Check if there's a queued message to process next
        if (messageQueue.current) {
          const queuedMessage = messageQueue.current;
          messageQueue.current = null;
          typeMessage(queuedMessage);
        }
      }
    };
    
    // Start typing after a shorter delay
    setTimeout(typeCharacter, 200);
  }, []);
  
  // Helper function to check if character is punctuation
  const isPunctuation = (char: string): boolean => {
    return ['.', ',', '!', '?', ';', ':'].includes(char);
  };

  const generateResponse = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the appropriate model based on selection
      let response: string;
      
      if (selectedModel === 'gemini-2.0-flash') {
        response = await generateGemini2FlashResponse(userMessage);
      } else {
        // Default to 1.5 Flash
        response = await generateGeminiVisionResponse(userMessage);
      }

      if (!response) {
        throw new Error('No response received from the AI');
      }

      return response;
    } catch (err: any) {
      console.error('Error generating response:', err);
      setError(err.message || 'Failed to generate response');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Clear any existing errors
    setError(null);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Generate AI response
    const response = await generateResponse(content);
    
    if (response) {
      // If already typing, queue this message
      if (isTyping) {
        messageQueue.current = response;
      } else {
        // Start typing animation for this message
        typeMessage(response);
      }
    }
  }, [generateResponse, isTyping, typeMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    messageQueue.current = null;
    currentMessageRef.current = null;
  }, []);

  return {
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage,
    clearMessages
  };
};

export default useChat; 