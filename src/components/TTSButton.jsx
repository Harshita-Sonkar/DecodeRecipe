import React, { useState, useEffect, useRef } from 'react';

const TranslationAndSpeech = () => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedText, setSelectedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const audioRef = useRef(null);
  
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('http://localhost:5000/translation/languages');
        const data = await response.json();
        
        if (data.success) {
          setLanguages(data.languages);
        }
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
    
    fetchLanguages();
    
    document.addEventListener('mouseup', handleTextSelection);
    
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, []);
  
  // Handle selected text
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text) {
      setSelectedText(text);
      setTranslatedText(''); 
      setShowTranslation(false);
      setAudioData(null);
      
      // Get the position of the selection
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Position the widget near the selection
        setPosition({
          x: rect.left + window.scrollX,
          y: rect.bottom + window.scrollY + 10
        });
      }
    }
  };
  
  const translateAndSpeak = async () => {
    if (!selectedText) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/text-to-speech/selected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: selectedText,
          lang: selectedLanguage,
          translate: true
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAudioData(data.audio_data); 
        setTranslatedText(data.translated_text);
        setShowTranslation(selectedLanguage !== 'en');
        
        // Create audio element
        if (audioRef.current) {
          audioRef.current.src = data.audio_data;
          audioRef.current.load();
        }
      }
    } catch (error) {
      console.error('Error translating and generating speech:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle audio ended event
  useEffect(() => {
    const audioElement = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    if (audioElement) {
      audioElement.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioData]);
  
  return (
    <div 
      className="fixed flex bg-neutral justify-around rounded-full h-10 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="flex">
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="m-3 bg-neutral rounded-md mt-2"
        >
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center">
        <div className="space-x-2 flex items-center">
          <button
            onClick={translateAndSpeak}
            disabled={!selectedText || isLoading}
            className={`px-4 py-2 rounded-full text-white ${!selectedText || isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-accent hover:bg-neutral focus:outline-none focus:ring-2 focus:ring-neutral'}`}
          >
            {isLoading ? '...' : '🎤︎'}
          </button>
          
          {audioData && (
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 rounded-full text-white bg-accent hover:bg-neutral focus:outline-none"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          )}
          
          <audio ref={audioRef} src={audioData} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default TranslationAndSpeech;