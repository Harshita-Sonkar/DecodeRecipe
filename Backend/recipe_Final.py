from flask import Flask, Response, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import base64
import os
import io
import json
import logging
import requests
from PIL import Image
import torch
import torchvision.transforms as transforms
import timm
from gtts import gTTS
from deep_translator import GoogleTranslator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)
load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
logger.info(f"Using device: {device}")

# Define CustomEfficientNet class
class CustomEfficientNet(torch.nn.Module):
    def __init__(self, num_classes=206):  
        super(CustomEfficientNet, self).__init__()
        self.model = timm.create_model('efficientnet_b0', pretrained=True)
        self.model.classifier = torch.nn.Linear(self.model.num_features, num_classes)

    def forward(self, x):
        return self.model(x)

# Load class labels
def load_class_labels():
    try:
        # Original raw class labels
        raw_labels = ['aam_panna', 'adhirasam', 'aloo_gobi', 'aloo_matar', 'aloo_methi', 'aloo_pattice', 'aloo_shimla_mirch', 
                  'aloo_tikki', 'aloo_vadi', 'anarsa', 'appe', 'ariselu', 'baingan_bharta', 'bandar_laddu', 'barfi', 
                  'basundi', 'bebinca', 'beetroot_tikki', 'besan_ladoo', 'bhakarwadi', 'bhapa_doi', 'bhatura', 'bhel_puri', 
                  'bhindi_masala', 'biryani', 'bisi_bele_bath', 'bombay_aloo', 'boondi', 'bread_pakora', 'butter_chicken', 
                  'capsicum_curry', 'chaas', 'chai', 'chakli', 'chak_hao_kheer', 'cham_cham', 'chana_chaat', 'chana_masala', 
                  'chapati', 'chawal', 'cheela', 'cheese_naan', 'chicken_65', 'chicken_chilli', 'chicken_korma', 'chicken_lolipop', 
                  'chicken_razala', 'chicken_seekh_kebab', 'chicken_tikka', 'chicken_tikka_masala', 'chikki', 
                  'chilli_cheese_toastie', 'chole_bhature', 'chowmein', 'coconut_chutney', 'corn_cheese_balls', 
                  'daal_bhaati_churma', 'daal_puri', 'dabeli', 'dahi_bhalla', 'dahi_chaat', 'dal_makhani', 'dal_rice', 
                  'dal_tadka', 'dharwad_pedha', 'dhokla', 'doodhpak', 'double_ka_meetha', 'dum_aloo', 'egg_bhurji', 
                  'egg_curry', 'egg_fried_rice', 'fafda', 'falafel', 'falooda', 'fara', 'fish_curry', 'frankies', 
                  'fruit_custard', 'gajar_ka_halwa', 'galouti_kebab', 'gavvalu', 'ghevar', 'gobi_manchurian', 'gujiya', 
                  'gulab_jamun', 'gulgula', 'halwa', 'handvo', 'hara_bhara_kabab', 'idli_sambhar', 'imarti', 'jalebi', 
                  'jeera_rice', 'kachori', 'kadai_chicken', 'kadai_paneer', 'kadhi_chawal', 'kadhi_pakoda', 'kajjikaya', 
                  'kaju_katli', 'kakinada_khaja', 'kalakand', 'karela_bharta', 'kathal_curry', 'kathi_roll', 'keema', 
                  'khandvi', 'kheer', 'khichdi', 'kofta', 'kosha_mangsho', 'kulcha', 'kulfi', 'lassi', 'ledikeni', 
                  'lemon_rasam', 'lemon_rice', 'litti_chokha', 'lyangcha', 'maach_jhol', 'makki_di_roti_sarson_da_saag', 
                  'malai_chaap', 'malai_kofta', 'malapua', 'mango_chutney', 'mango_lassi', 'matar_paneer', 'misal_pav', 
                  'misi_roti', 'misti_doi', 'modak', 'momos', 'moong_dal_halwa', 'motichoor_ladoo', 'mushroom_curry', 
                  'mysore_masala_dosa', 'mysore_pak', 'naan', 'nankhatai', 'navratan_korma', 'neer_dosa', 'pakora', 
                  'palak_paneer', 'paneer_butter_masala', 'paneer_chilli', 'paneer_lababdar', 'paneer_tikka', 'pani_puri', 
                  'paratha', 'pav_bhaji', 'peda', 'phirni', 'pithe', 'poha', 'pongal', 'poornalu', 'pootharekulu', 
                  'prawn_curry', 'pulao', 'pumpkin_sabzi', 'puran_poli', 'qubani_ka_meetha', 'rabri', 'ragda_patties', 
                  'raita', 'rajma_chawal', 'rasam', 'rasgulla', 'ras_malai', 'rogan_josh', 'roti', 'sabudana_vada', 
                  'sambhar_vada', 'samosa', 'samosa_chaat', 'sandesh', 'sevayian', 'sev_puri', 'shahi_paneer', 'shahi_tukda', 
                  'shankarpali', 'sheera', 'sheer_korma', 'shrikhand', 'shwarma', 'sohan_halwa', 'sohan_papdi', 
                  'soya_chap_masala', 'sukat_chutney', 'sutar_feni', 'taak', 'tamarind_rice', 'tandoori_chicken', 
                  'thalipeeth', 'thandai', 'thepla', 'tikki_chaat', 'undhiyu', 'unni_appam', 'upma', 'uttapam', 'vada_pav', 
                  'veg_cutlet', 'veg_kolhapuri', 'vindaloo']
        
        # Format class labels for better presentation
        class_labels = [label.replace("_", " ").title() for label in raw_labels]
        logger.info(f"Loaded {len(class_labels)} class labels")
        return class_labels
    except Exception as e:
        logger.error(f"Error loading class labels: {str(e)}")
        return []

# Load the model
def load_model():
    try:
        model = CustomEfficientNet().to(device)
        model_weights_path = 'Backend\model_weights.pth'
        model.load_state_dict(torch.load(model_weights_path, map_location=device))
        model.eval()
        logger.info("Model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return None

# Image preprocessing transformation
transform = transforms.Compose([
    transforms.Resize(224),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Load model and class labels
model = load_model()
class_labels = load_class_labels()

# Function to predict food item from image
def predict_with_model(image):
    try:
        if not class_labels or model is None:
            logger.error("Model or class labels are not available")
            return None, 0.0

        if image.mode != 'RGB':
            image = image.convert('RGB')

        image_tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            max_prob, predicted = torch.max(probabilities, 1)

            confidence = max_prob.item()
            predicted_class = class_labels[predicted.item()]

            logger.info(f"Model predicted {predicted_class} with confidence {confidence}")
            return predicted_class, confidence
    except Exception as e:
        logger.error(f"Error in model prediction: {str(e)}")
        return None, 0.0

# Gemini API endpoint
def get_gemini_endpoint():
    return f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

# Function to encode image to base64
def encode_image_to_base64(image_data):
    try:
        return base64.b64encode(image_data).decode('utf-8')
    except Exception as e:
        logger.error(f"Error encoding image: {str(e)}")
        raise

# Function to get recipe from image using Gemini API
def get_recipe_from_image(image_data, predicted_class=None, servings=1):
    try:
        base64_image = encode_image_to_base64(image_data)
        
        # Set the prompt based on whether we have a model prediction
        if predicted_class:
            prompt = f"""
            The image is identified as {predicted_class}, an Indian dish.
            Generate a detailed simple format recipe adjusted for {servings} servings, with no formatting, including:
            """
            identification_source = "model"
        else:
            prompt = f"""
            Identify this dish and generate a detailed recipe for it, adjusting the ingredients for {servings} servings.
            """
            identification_source = "gemini"

        prompt += """
        - List of ingredients with correct measurements for the given servings
        - Step-by-step cooking instructions
        - Cooking time and servings
        - YouTube link for the dish
        
        Return the response in JSON format:
        {
            "name": "Dish Name",
            "description": "Short description",
            "ingredients": ["Ingredient 1", "Ingredient 2"],
            "instructions": ["Step 1.", "Step 2."],
            "prepTime": "preparation time",
            "cookTime": "cooking time",
            "servings": "servings",
            "ytLink": "YouTube Link"
        }
        """

        headers = {'Content-Type': 'application/json'}
        data = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": base64_image
                        }
                    }
                ]
            }]
        }

        logger.info(f"Using identification source: {identification_source}")
        
        response = requests.post(get_gemini_endpoint(), headers=headers, json=data)
        response.raise_for_status()
        
        response_data = response.json()
        
        if 'candidates' in response_data and response_data['candidates']:
            recipe_text = response_data['candidates'][0]['content']['parts'][0]['text']
            recipe_json = json.loads(recipe_text.replace('```json', '').replace('```', '').strip())
            
            # Add identification source to the recipe data
            recipe_json["identification_source"] = identification_source
            return recipe_json

        raise ValueError("No valid response from Gemini API")

    except Exception as e:
        logger.error(f"Error generating recipe: {str(e)}")
        raise

@app.route('/upload', methods=['POST'])
def upload():
    try:
        if 'photo' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['photo']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        servings = request.form.get("servings")
        if not servings or not servings.isdigit():
            servings = 1
        servings = int(servings)

        # Optional force mode
        force_mode = request.form.get("force_mode", "auto")  # Options: "model", "gemini", "auto"

        # Read image data and create PIL Image
        image_data = file.read()
        file.seek(0)
        image = Image.open(io.BytesIO(image_data))
        image.load()
    
        # Save the image
        os.makedirs('uploads', exist_ok=True)
        image_filename = file.filename
        image_filepath = os.path.join('uploads', image_filename)
        file.save(image_filepath)

        # Use model to predict food class
        predicted_class, confidence = predict_with_model(image) if model else (None, 0.0)
        
        # Determine whether to use the model prediction based on force_mode
        if force_mode == "model":
            # Force using model prediction even if confidence is low
            use_prediction = predicted_class is not None
        elif force_mode == "gemini":
            # Force using Gemini for identification
            use_prediction = False
        else:  # "auto" mode
            use_prediction = predicted_class is not None and confidence >= 0.5
        
        # Get recipe using Gemini, with predicted class if available and confidence is high
        recipe_data = get_recipe_from_image(
            image_data, 
            predicted_class if use_prediction else None, 
            servings
        )

        # Return the recipe data along with model prediction info and identification source
        return jsonify({
            'message': 'Success',
            'dish_name': recipe_data.get("name"),
            'description': recipe_data.get("description"),
            'ingredients': recipe_data.get("ingredients"),
            'instructions': recipe_data.get("instructions"),
            'prepTime': recipe_data.get("prepTime"),
            'cookTime': recipe_data.get("cookTime"),
            'servings': servings,  
            'ytLink': recipe_data.get("ytLink"),
            'image_url': f'/uploads/{image_filename}',
            'model_prediction': {
                'class': predicted_class,
                'confidence': round(confidence * 100, 2),
                'used_for_recipe': use_prediction
            } if predicted_class else None,
            'identification_source': recipe_data.get("identification_source", "unknown")
        })

    except Exception as e:
        logger.error(f"Error processing upload: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<filename>')
def serve_image(filename):
    return send_from_directory('uploads', filename)

def get_indian_languages():
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

@app.route('/text-to-speech/languages', methods=['GET'])
def get_tts_languages():
    languages = get_indian_languages()
    return jsonify({
        'success': True,
        'languages': languages
    })

@app.route('/translation/languages', methods=['GET'])
def get_translation_languages():
    languages = get_indian_languages()
    return jsonify({
        'success': True,
        'languages': languages
    })

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

@app.route('/text-to-speech/stream', methods=['POST'])
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
        translate = data.get('translate', True)
        if translate and lang != 'en':
            translated_text = translate_text(text, lang)
        else:
            translated_text = text
        
        tts = gTTS(text=translated_text, lang=lang)
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        def generate():
            yield mp3_fp.getvalue()
            
        return Response(generate(), mimetype="audio/mpeg")
        
    except Exception as e:
        logger.error(f"Error streaming TTS: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/text-to-speech/selected', methods=['POST'])
def text_to_speech_selected():
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
            
        text = data.get('text')
        lang = data.get('lang', 'en')
        translate = data.get('translate', True)
        
        if translate and lang != 'en':
            translated_text = translate_text(text, lang)
        else:
            translated_text = text
        tts = gTTS(text=translated_text, lang=lang)
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)
        
        mp3_base64 = base64.b64encode(mp3_fp.read()).decode('utf-8')
        audio_data_uri = f"data:audio/mp3;base64,{mp3_base64}"
        
        return jsonify({
            'success': True,
            'audio_data': audio_data_uri,
            'translated_text': translated_text
        })
        
    except Exception as e:
        logger.error(f"Error in text-to-speech: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)