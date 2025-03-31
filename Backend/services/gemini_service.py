import base64
import json
import logging
import requests
from config import GEMINI_API_ENDPOINT, ALLERGEN_SUBSTITUTES

logger = logging.getLogger(__name__)

def encode_image_to_base64(image_data):
    """
    Encode image data to base64 for Gemini API
    """
    try:
        return base64.b64encode(image_data).decode('utf-8')
    except Exception as e:
        logger.error(f"Error encoding image: {str(e)}")
        raise

def get_recipe_from_image(image_data, predicted_class=None, servings=1, allergies=None):
    """
    Get recipe from image using Gemini API with allergy considerations
    
    Args:
        image_data: Binary image data
        predicted_class: Class predicted by the model (optional)
        servings: Number of servings to prepare (default: 1)
        allergies: List of allergies to consider (optional)
        
    Returns:
        Recipe data in JSON format
    """
    try:
        base64_image = encode_image_to_base64(image_data)
        
        allergy_guidance = ""
        if allergies and isinstance(allergies, list) and len(allergies) > 0:
            allergy_guidance = "Important: The person has the following allergies: " + ", ".join(allergies) + ". "
            allergy_guidance += "Please avoid these allergens in the recipe and suggest appropriate substitutes. "
            
            for allergy in allergies:
                allergy_lower = allergy.lower()
                for allergen, substitutes in ALLERGEN_SUBSTITUTES.items():
                    if allergy_lower in allergen or allergen in allergy_lower:
                        allergy_guidance += f"For {allergen}, you can use {', '.join(substitutes)}. "
        
        if predicted_class:
            prompt = f"""
            The image is identified as {predicted_class}, an Indian dish.
            {allergy_guidance}
            Generate a detailed simple format recipe adjusted for {servings} servings, with no formatting, including:
            """
            identification_source = "model"
        else:
            prompt = f"""
            Identify this dish and generate a detailed recipe for it, adjusting the ingredients for {servings} servings.
            {allergy_guidance}
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
        logger.info(f"Allergies considered: {allergies}")
        
        response = requests.post(GEMINI_API_ENDPOINT, headers=headers, json=data)
        response.raise_for_status()
        
        response_data = response.json()
        
        if 'candidates' in response_data and response_data['candidates']:
            recipe_text = response_data['candidates'][0]['content']['parts'][0]['text']
            recipe_json = json.loads(recipe_text.replace('```json', '').replace('```', '').strip())
            
            recipe_json["identification_source"] = identification_source
            
            if allergies:
                recipe_json["allergen_free"] = allergies
                
            return recipe_json

        raise ValueError("No valid response from Gemini API")

    except Exception as e:
        logger.error(f"Error generating recipe: {str(e)}")
        raise