import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

MODEL_WEIGHTS_PATH = 'Backend/model_weights.pth'

GEMINI_API_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

ALLERGEN_SUBSTITUTES = {
    'peanuts': ['sunflower seeds', 'pumpkin seeds', 'almonds', 'cashews'],
    'tree nuts': ['seeds', 'coconut', 'sunflower seeds', 'pumpkin seeds'],
    'milk': ['almond milk', 'soy milk', 'coconut milk', 'oat milk'],
    'eggs': ['flax seeds mixed with water', 'applesauce', 'mashed banana', 'tofu'],
    'soy': ['chickpeas', 'lentils', 'hemp seeds', 'quinoa'],
    'wheat': ['rice flour', 'almond flour', 'coconut flour', 'gluten-free flour blend'],
    'gluten': ['rice flour', 'almond flour', 'coconut flour', 'gluten-free flour blend'],
    'fish': ['tofu', 'jackfruit', 'mushrooms', 'lentils'],
    'shellfish': ['mushrooms', 'jackfruit', 'tofu', 'tempeh'],
    'sesame': ['hemp seeds', 'poppy seeds', 'flax seeds', 'sunflower seeds'],
    'mustard': ['turmeric', 'ginger', 'horseradish', 'wasabi'],
    'celery': ['fennel', 'celeriac', 'jicama', 'bok choy'],
    'lupin': ['chickpeas', 'lentils', 'peas', 'beans'],
    'sulphites': ['vinegar', 'lemon juice', 'lime juice', 'citric acid']
}