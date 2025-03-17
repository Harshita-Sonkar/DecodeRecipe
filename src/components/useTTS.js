// Alternative implementation using Microsoft Azure services for reliable text translation and speech
// Note: This code requires API keys and a paid subscription

// useTTS.js
import { useState } from "react";

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Map of language codes to simpler codes for API calls
  const languageCodeMap = {
    "en-US": "en",
    "hi-IN": "hi",
    "ta-IN": "ta",
    "te-IN": "te",
    "mr-IN": "mr",
    "bn-IN": "bn",
    "kn-IN": "kn",
    "ml-IN": "ml",
    "gu-IN": "gu",
    "pa-IN": "pa"
  };
  
  // Function to translate and speak text
  const speak = async (text, language = "en-US") => {
    if (!text) return;
    
    try {
      const audioElement = new Audio();
      setIsLoading(true);
      
      // Store current language code
      const langCode = languageCodeMap[language] || "en";
      
      // Create URL with parameters for the function
      const functionUrl = `https://your-function-url.azurewebsites.net/api/translate-and-speak`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: langCode
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get blob from response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Set up audio element
      audioElement.src = audioUrl;
      audioElement.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audioElement.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      // Start playback
      setIsLoading(false);
      setIsSpeaking(true);
      audioElement.play();
      
      // Store reference for stopping
      window.currentAudio = audioElement;
      
    } catch (error) {
      console.error("Translation or speech error:", error);
      setIsLoading(false);
      setIsSpeaking(false);
    }
  };
  
  const stop = () => {
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio = null;
    }
    setIsSpeaking(false);
    setIsLoading(false);
  };
  
  return { isSpeaking, isLoading, speak, stop };
};

export default useTextToSpeech;