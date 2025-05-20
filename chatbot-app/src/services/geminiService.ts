import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiApiKey } from "../utils/env";

// Use environment variable for API key instead of hardcoding
const API_KEY = getGeminiApiKey();

// Initialize the Gemini API client
const getGeminiClient = () => {
  return new GoogleGenerativeAI(API_KEY);
};

// Function for Gemini Flash model (single message)
export const generateGeminiVisionResponse = async (
  prompt: string
): Promise<string> => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log('Sending request to Gemini Flash...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini Flash API');
    return text;
  } catch (error: any) {
    console.error('Error calling Gemini Flash API:', error);
    
    if (error.message) {
      throw new Error(`Gemini Flash API Error: ${error.message}`);
    }
    
    throw new Error('Failed to generate response from Gemini Flash. Please try again later.');
  }
};

// Function for Gemini 2.0 Flash model (higher throughput)
export const generateGemini2FlashResponse = async (
  prompt: string
): Promise<string> => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log('Sending request to Gemini 2.0 Flash...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini 2.0 Flash API');
    return text;
  } catch (error: any) {
    console.error('Error calling Gemini 2.0 Flash API:', error);
    
    if (error.message) {
      throw new Error(`Gemini 2.0 Flash API Error: ${error.message}`);
    }
    
    throw new Error('Failed to generate response from Gemini 2.0 Flash. Please try again later.');
  }
};

// Alternative implementation using fetch directly (similar to the curl command)
export const generateGeminiResponseRaw = async (
  prompt: string,
  model: string = "gemini-2.0-flash"
): Promise<string> => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error(`Error calling ${model} API directly:`, error);
    
    if (error.message) {
      throw new Error(`${model} API Error: ${error.message}`);
    }
    
    throw new Error(`Failed to generate response from ${model}. Please try again later.`);
  }
};

export const validateGeminiKey = async (): Promise<{isValid: boolean; errorMessage?: string}> => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log('Validating Gemini API key...');
    const prompt = "Hello, this is a test message to validate the API key.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Key validation successful');
    return {isValid: true};
  } catch (error: any) {
    console.error('API key validation error:', error);
    
    let errorMessage = 'Invalid API key';
    if (error.message) {
      errorMessage = `Gemini API Error: ${error.message}`;
    }
    
    return {isValid: false, errorMessage};
  }
}; 