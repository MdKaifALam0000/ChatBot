import axios from 'axios';

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

type OpenAIRole = 'system' | 'user' | 'assistant';

interface OpenAIMessage {
  role: OpenAIRole;
  content: string;
}

interface OpenAIRequestBody {
  model: string;
  messages: OpenAIMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  choices: {
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const generateChatResponse = async (
  messages: { content: string; isUser: boolean }[],
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error('No OpenAI API key provided');
  }
  
  // Validate API key format first
  if (!apiKey.startsWith('sk-') && !apiKey.startsWith('sk-proj-')) {
    throw new Error('Invalid OpenAI API key format. Keys should start with "sk-" or "sk-proj-"');
  }

  try {
    // Convert messages to OpenAI format
    const formattedMessages: OpenAIMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant. Provide concise and accurate responses to user questions.',
      },
    ];
    
    // Add user and assistant messages
    messages.forEach(msg => {
      formattedMessages.push({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      });
    });

    const requestBody: OpenAIRequestBody = {
      model: 'gpt-3.5-turbo', // You can upgrade to gpt-4 if available
      messages: formattedMessages,
      max_tokens: 1000,
      temperature: 0.7,
    };

    const response = await axios.post<OpenAIResponse>(
      OPENAI_API_URL,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('No response from OpenAI');
    }
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    // Return a friendly error message or the specific error from OpenAI
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(`OpenAI API Error: ${error.response.data.error.message}`);
    }
    throw new Error('Failed to generate response. Please try again later.');
  }
};

// Function to check if an OpenAI API key is valid
export const validateOpenAIKey = async (apiKey: string): Promise<{isValid: boolean; errorMessage?: string}> => {
  if (!apiKey) return {isValid: false, errorMessage: 'API key is empty'};
  
  // Check if key has proper format (starts with sk- or sk-proj-)
  if (!apiKey.startsWith('sk-') && !apiKey.startsWith('sk-proj-')) {
    return {isValid: false, errorMessage: 'API key should start with "sk-" or "sk-proj-"'};
  }
  
  try {
    const requestBody: OpenAIRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Hello'
        }
      ],
      max_tokens: 5
    };

    await axios.post(
      OPENAI_API_URL,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    return {isValid: true};
  } catch (error: any) {
    console.error('API key validation error:', error);
    
    // Extract more detailed error message if available
    let errorMessage = 'Invalid API key';
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = `OpenAI API Error: ${error.response.data.error.message}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {isValid: false, errorMessage};
  }
}; 