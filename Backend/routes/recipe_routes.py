import os
import io
import logging
from flask import Blueprint, request, jsonify, send_from_directory
from PIL import Image
from services.model_service import predict_food_from_image
from services.gemini_service import get_recipe_from_image
from utils.helpers import save_uploaded_image

logger = logging.getLogger(__name__)

recipe_bp = Blueprint('recipe', __name__)

@recipe_bp.route('/upload', methods=['POST'])
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
        
        allergies = request.form.get("allergies")
        if allergies:
            allergies = [allergen.strip() for allergen in allergies.split(',')]
        else:
            allergies = []

        force_mode = request.form.get("force_mode", "auto")

        image_data = file.read()
        file.seek(0)
        image = Image.open(io.BytesIO(image_data))
        image.load()
    
        image_filepath = save_uploaded_image(file)
        image_filename = os.path.basename(image_filepath)

        predicted_class, confidence = predict_food_from_image(image)
        
        if force_mode == "model":
            use_prediction = predicted_class is not None
        elif force_mode == "gemini":
            use_prediction = False
        else: 
            use_prediction = predicted_class is not None and confidence >= 0.5
        
        recipe_data = get_recipe_from_image(
            image_data, 
            predicted_class if use_prediction else None, 
            servings,
            allergies
        )

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
            'identification_source': recipe_data.get("identification_source", "unknown"),
            'allergen_free': recipe_data.get("allergen_free", [])
        })

    except Exception as e:
        logger.error(f"Error processing upload: {str(e)}")
        return jsonify({'error': str(e)}), 500

@recipe_bp.route('/uploads/<filename>')
def serve_image(filename):
    return send_from_directory('uploads', filename)