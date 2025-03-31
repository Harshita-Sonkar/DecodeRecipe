import os
import logging
import base64

logger = logging.getLogger(__name__)

def save_uploaded_image(file, directory='uploads'):
    """
    Save an uploaded image file to the specified directory
    
    Args:
        file: File object from request.files
        directory: Directory to save the image (default: 'uploads')
        
    Returns:
        Path to the saved image
    """
    try:
        os.makedirs(directory, exist_ok=True)
        image_filename = file.filename
        image_filepath = os.path.join(directory, image_filename)
        file.save(image_filepath)
        return image_filepath
    except Exception as e:
        logger.error(f"Error saving image: {str(e)}")
        raise

def create_audio_data_uri(audio_data):
    """
    Create a data URI for audio data
    
    Args:
        audio_data: Audio data in binary format
        
    Returns:
        Data URI string
    """
    try:
        mp3_base64 = base64.b64encode(audio_data).decode('utf-8')
        return f"data:audio/mp3;base64,{mp3_base64}"
    except Exception as e:
        logger.error(f"Error creating audio data URI: {str(e)}")
        raise