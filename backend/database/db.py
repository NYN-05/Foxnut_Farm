from pymongo import MongoClient
from flask import current_app, g
import os

def get_db():
    """Get database connection"""
    if 'db' not in g:
        client = MongoClient(current_app.config['MONGODB_URI'])
        g.db = client[current_app.config['MONGODB_DB_NAME']]
    return g.db

def init_db(app):
    """Initialize database connection"""
    @app.teardown_appcontext
    def close_db(error):
        db = g.pop('db', None)
        if db is not None:
            db.client.close()
    
    # Create indexes on first run
    with app.app_context():
        try:
            db = get_db()
            
            # Users collection indexes
            db.users.create_index('email', unique=True)
            db.users.create_index('createdAt')
            
            # Products collection indexes
            db.products.create_index('slug', unique=True)
            db.products.create_index('category')
            db.products.create_index('tags')
            db.products.create_index([('name', 'text'), ('description', 'text')])
            
            # Orders collection indexes
            db.orders.create_index('userId')
            db.orders.create_index('orderNumber', unique=True)
            db.orders.create_index('createdAt')
            db.orders.create_index('orderStatus')
            
            # Reviews collection indexes
            db.reviews.create_index('productId')
            db.reviews.create_index('userId')
            db.reviews.create_index([('userId', 1), ('productId', 1)], unique=True)
            
            # Newsletter collection indexes
            db.newsletter.create_index('email', unique=True)
            
            # Subscriptions collection indexes
            db.subscriptions.create_index('userId')
            db.subscriptions.create_index('status')
            
            print("✅ Database indexes created successfully")
            
        except Exception as e:
            print(f"⚠️  Error creating indexes: {str(e)}")

def seed_products():
    """Seed initial products data"""
    db = get_db()
    
    # Check if products already exist
    if db.products.count_documents({}) > 0:
        return
    
    products = [
        {
            "name": "Himalayan Salt Foxnuts",
            "slug": "himalayan-salt-foxnuts",
            "description": "Perfectly roasted with pure Himalayan pink salt for a savory crunch",
            "price": 12.99,
            "compareAtPrice": 15.99,
            "images": [
                {
                    "url": "/products/himalayan-salt.jpg",
                    "alt": "Bowl of roasted foxnuts seasoned with Himalayan pink salt",
                    "isPrimary": True
                }
            ],
            "category": "salty",
            "tags": ["organic", "gluten-free", "vegan", "low-calorie"],
            "stock": 100,
            "sku": "FN-HIM-SALT-001",
            "nutritionFacts": {
                "servingSize": "30g",
                "calories": 140,
                "protein": "4g",
                "carbs": "18g",
                "fat": "6g",
                "fiber": "2g"
            },
            "ingredients": ["Organic Foxnuts (Makhana)", "Himalayan Pink Salt", "Extra Virgin Olive Oil"],
            "averageRating": 4.8,
            "totalReviews": 127,
            "isActive": True
        },
        {
            "name": "Chili Garlic Foxnuts",
            "slug": "chili-garlic-foxnuts",
            "description": "A spicy kick with aromatic garlic - bold flavor in every bite",
            "price": 13.99,
            "compareAtPrice": 16.99,
            "images": [
                {
                    "url": "/products/chili-garlic.jpg",
                    "alt": "Spicy chili garlic flavored foxnuts with visible spices",
                    "isPrimary": True
                }
            ],
            "category": "spicy",
            "tags": ["organic", "gluten-free", "vegan", "spicy"],
            "stock": 85,
            "sku": "FN-CHI-GAR-002",
            "nutritionFacts": {
                "servingSize": "30g",
                "calories": 145,
                "protein": "4g",
                "carbs": "19g",
                "fat": "6g",
                "fiber": "2g"
            },
            "ingredients": ["Organic Foxnuts", "Chili Powder", "Garlic", "Olive Oil", "Sea Salt"],
            "averageRating": 4.9,
            "totalReviews": 98,
            "isActive": True
        },
        {
            "name": "Caramel Crunch Foxnuts",
            "slug": "caramel-crunch-foxnuts",
            "description": "Sweet indulgence meets healthy snacking - guilt-free dessert",
            "price": 14.99,
            "compareAtPrice": 17.99,
            "images": [
                {
                    "url": "/products/caramel-crunch.jpg",
                    "alt": "Golden caramel coated foxnuts with glossy finish",
                    "isPrimary": True
                }
            ],
            "category": "sweet",
            "tags": ["organic", "gluten-free", "vegetarian", "dessert"],
            "stock": 120,
            "sku": "FN-CAR-CRU-003",
            "nutritionFacts": {
                "servingSize": "30g",
                "calories": 160,
                "protein": "3g",
                "carbs": "22g",
                "fat": "7g",
                "fiber": "2g",
                "sugar": "8g"
            },
            "ingredients": ["Organic Foxnuts", "Organic Cane Sugar", "Butter", "Vanilla Extract", "Sea Salt"],
            "averageRating": 5.0,
            "totalReviews": 152,
            "isActive": True
        }
    ]
    
    db.products.insert_many(products)
    print(f"✅ Seeded {len(products)} products")
