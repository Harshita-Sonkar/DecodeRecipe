from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

SPOONACULAR_API_KEY = os.getenv('SPOONACULAR_API_KEY')

spoonacular_bp = Blueprint('spoonacular', __name__, url_prefix='/api/recipes')

@spoonacular_bp.route('/indian', methods=['GET'])
def get_indian_recipes():
    try:
        query = request.args.get('query', '')
        number = int(request.args.get('number', 12))
        offset = int(request.args.get('offset',0))
        
        params = {
            'apiKey': SPOONACULAR_API_KEY,
            'cuisine': 'indian',
            'number': number,
            'offset': offset,
            'addRecipeInformation': True,
            'fillIngredients': True,
        }
        
        if query:
            params['query'] = query
        
        response = requests.get(
            'https://api.spoonacular.com/recipes/complexSearch',
            params=params
        )
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch recipes from Spoonacular API'}), response.status_code
        
        return jsonify(response.json())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@spoonacular_bp.route('/<int:recipe_id>', methods=['GET'])
def get_recipe_details(recipe_id):
    try:
        response = requests.get(
            f'https://api.spoonacular.com/recipes/{recipe_id}/information',
            params={
                'apiKey': SPOONACULAR_API_KEY,
                'includeNutrition': False
            }
        )
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch recipe details'}), response.status_code
        
        return jsonify(response.json())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500