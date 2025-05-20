import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGeminiApiKey } from "./utils/env";

async function testGeminiModels() {
  // Use environment variable instead of hardcoded API key
  const API_KEY = getGeminiApiKey();
  
  // Check if API key is available
  if (!API_KEY) {
    console.error("No API key found in environment variables. Please set REACT_APP_GOOGLE_API_KEY in your .env file.");
    return;
  }
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  console.log("Testing Gemini models...");
  
  try {
    console.log("\nTesting gemini-1.5-flash...");
    const modelVision = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const resultVision = await modelVision.generateContent("Describe this test");
    console.log("✅ gemini-1.5-flash works!");
    console.log(resultVision.response.text());
  } catch (error) {
    console.error("❌ Error with gemini-1.5-flash:", error);
  }
  
  try {
    console.log("\nTesting gemini-2.0-flash...");
    const modelFlash = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const resultFlash = await modelFlash.generateContent("Hello from Gemini 2.0 Flash test");
    console.log("✅ gemini-2.0-flash works!");
    console.log(resultFlash.response.text());
  } catch (error) {
    console.error("❌ Error with gemini-2.0-flash:", error);
  }
  
  // List available model names from the API
  try {
    console.log("\nListing available models...");
    // This is not available in the current SDK version
    console.log("Note: The current SDK doesn't have a direct method to list models.");
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

testGeminiModels().catch(console.error); 