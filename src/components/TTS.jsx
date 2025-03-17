import React, { useState, useEffect, useRef } from 'react';

const TranslationAndSpeech = () => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedText, setSelectedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
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
        
        if (audioRef.current) {
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error translating and generating speech:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="absolute flex bg-neutral justify-around rounded-full h-10" >
      <div className="flex">
        {/* <label htmlFor="language-select" className="block text-[12px] font-medium text-gray-700 mb-1">
          Select Language:
        </label> */}
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
      
      <div className="">
        {/* <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Selected text:</span>
          <span className="text-sm italic">{selectedText || 'None selected'}</span>
        </div> */}
        
        <div className="space-x-2">
          <button
            onClick={translateAndSpeak}
            disabled={!selectedText || isLoading}
            className={`px-4 py-2 rounded-full text-white ${!selectedText || isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-accent left-20 hover:bg-neutral focus:outline-none focus:ring-2 focus:ring-neutral'}`}
          >
            {isLoading ? 'Processing...' : '🎤︎'}
          </button>
        </div>
        
        {/* {showTranslation && translatedText && (
          <div className="">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Translation:</h3>
            <p className="text-sm">{translatedText}</p>
          </div>
        )} */}
        
        {audioData && (
          <div className="">
            <audio ref={audioRef} src={audioData} controls className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationAndSpeech;