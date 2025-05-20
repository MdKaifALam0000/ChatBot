import { useContext } from 'react';
import { OpenAIContext } from '../context/OpenAIContext';

export const useOpenAI = () => {
  const context = useContext(OpenAIContext);
  
  if (context === undefined) {
    throw new Error('useOpenAI must be used within an OpenAIProvider');
  }
  
  return context;
}; 