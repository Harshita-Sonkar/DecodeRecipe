from flask import Flask
from flask_cors import CORS
import logging
import os
from routes.recipe_routes import recipe_bp
from routes.translation_routes import translation_bp
from routes.spoonacular_routes import spoonacular_bp

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    CORS(app)
    os.makedirs('uploads', exist_ok=True)
    
    app.register_blueprint(recipe_bp)
    app.register_blueprint(translation_bp)
    app.register_blueprint(spoonacular_bp)
        
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True)