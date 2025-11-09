from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import routes
from routes.auth_routes import auth_bp
from routes.product_routes import product_bp
from routes.cart_routes import cart_bp
from routes.order_routes import order_bp
from routes.review_routes import review_bp
from routes.newsletter_routes import newsletter_bp
from routes.subscription_routes import subscription_bp
from routes.wishlist_routes import wishlist_bp
from routes.admin_routes import admin_bp

# Import database
from database.db import init_db

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    app.config['MONGODB_URI'] = os.getenv('MONGODB_URI')
    app.config['MONGODB_DB_NAME'] = os.getenv('MONGODB_DB_NAME', 'foxnuts_farm')
    
    # CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": os.getenv('FRONTEND_URL', 'http://localhost:5173'),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Initialize database
    init_db(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(review_bp, url_prefix='/api/reviews')
    app.register_blueprint(newsletter_bp, url_prefix='/api/newsletter')
    app.register_blueprint(subscription_bp, url_prefix='/api/subscriptions')
    app.register_blueprint(wishlist_bp, url_prefix='/api/wishlist')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Foxnuts Farm API is running'}, 200
    
    # Root endpoint
    @app.route('/')
    def root():
        return {
            'message': 'Welcome to Foxnuts Farm API',
            'version': '1.0.0',
            'docs': '/api/docs'
        }, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    print(f"\n🚀 Foxnuts Farm API Server Starting...")
    print(f"📍 Running on: http://{host}:{port}")
    print(f"🌍 CORS enabled for: {os.getenv('FRONTEND_URL', 'http://localhost:5173')}")
    print(f"🔧 Debug mode: {debug}\n")
    
    app.run(host=host, port=port, debug=debug)
