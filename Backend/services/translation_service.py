import io
import base64
import logging
from gtts import gTTS
from deep_translator import GoogleTranslator

logger = logging.getLogger(__name__)

def get_indian_languages():
    """
    Return a dictionary of supported Indian languages
    """
    return {
        'en': 'English',
        'hi': 'Hindi',
        'bn': 'Bengali',
        'te': 'Telugu',
        'ta': 'Tamil',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'pa': 'Punjabi',
        'ur': 'Urdu',
        'or': 'Oriya',
        'as': 'Assamese',
        'sd': 'Sindhi',
        'sa': 'Sanskrit'
    }

def translate_text(text, target_language):
    """
    Translate text to the target language using Google Translator
    """
    try:
        source_language = 'auto'
        
        language_mapping = {
            'or': 'odia',  
            'as': 'assamese',
            'sd': 'sindhi',
            'sa': 'sanskrit'
        }
        
        target = language_mapping.get(target_language, target_language)
        translator = GoogleTranslator(source=source_language, target=target)
        translated_text = translator.translate(text)
        
        return translated_text
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return text

def text_to_speech(text, lang='en', translate=True):
    """
    Convert text to speech
    
    Args:
        text: Text to convert to speech
        lang: Language code (default: 'en')
        translate: Whether to translate the text (default: True)
        
    Returns:
        Audio data in MP3 format
    """
    try:
        if translate and lang != 'en':
            translated_text = translate_text(text, lang)
        else:
            translated_text = text
            
        tts = gTTS(text=translated_text, lang=lang)
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        
        return mp3_fp.getvalue(), translated_text
        
    except Exception as e:
        logger.error(f"Error in text-to-speech: {str(e)}")
        raise