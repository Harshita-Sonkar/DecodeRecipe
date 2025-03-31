import logging
from flask import Blueprint, request, jsonify, Response
from services.translation_service import get_indian_languages, translate_text, text_to_speech
from utils.helpers import create_audio_data_uri

logger = logging.getLogger(__name__)

translation_bp = Blueprint('translation', __name__)

@translation_bp.route('/text-to-speech/languages', methods=['GET'])
def get_tts_languages():
    languages = get_indian_languages()
    return jsonify({
        'success': True,
        'languages': languages
    })

@translation_bp.route('/translation/languages', methods=['GET'])
def get_translation_languages():
    languages = get_indian_languages()
    return jsonify({
        'success': True,
        'languages': languages
    })

@translation_bp.route('/text-to-speech/stream', methods=['POST'])
def text_to_speech_stream():
    """
    Stream audio directly to the client without saving files
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
            
        text = data.get('text')
        lang = data.get('lang', 'en')
        translate_flag = data.get('translate', True)
        
        audio_data, _ = text_to_speech(text, lang, translate_flag)
            
        def generate():
            yield audio_data
            
        return Response(generate(), mimetype="audio/mpeg")
        
    except Exception as e:
        logger.error(f"Error streaming TTS: {str(e)}")
        return jsonify({'error': str(e)}), 500

@translation_bp.route('/text-to-speech/selected', methods=['POST'])
def text_to_speech_selected():
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
            
        text = data.get('text')
        lang = data.get('lang', 'en')
        translate_flag = data.get('translate', True)
        
        audio_data, translated_text = text_to_speech(text, lang, translate_flag)
        audio_data_uri = create_audio_data_uri(audio_data)
        
        return jsonify({
            'success': True,
            'audio_data': audio_data_uri,
            'translated_text': translated_text
        })
        
    except Exception as e:
        logger.error(f"Error in text-to-speech: {str(e)}")
        return jsonify({'error': str(e)}), 500