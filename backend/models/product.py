from database.db import get_db
from bson.objectid import ObjectId
from datetime import datetime

class Product:
    """Product model for managing products"""
    
    @staticmethod
    def create(product_data):
        """Create a new product"""
        db = get_db()
        
        # Check if slug exists
        if db.products.find_one({'slug': product_data['slug']}):
            raise ValueError('Product slug already exists')
        
        product_data['createdAt'] = datetime.utcnow()
        product_data['updatedAt'] = datetime.utcnow()
        product_data['averageRating'] = 0
        product_data['totalReviews'] = 0
        product_data['isActive'] = product_data.get('isActive', True)
        
        result = db.products.insert_one(product_data)
        product_data['_id'] = result.inserted_id
        
        return Product.format_product(product_data)
    
    @staticmethod
    def find_all(filters=None, page=1, limit=20, sort=None):
        """Find all products with pagination and filters"""
        db = get_db()
        
        query = filters or {}
        skip = (page - 1) * limit
        
        # Default sort by createdAt descending
        sort_by = sort or [('createdAt', -1)]
        
        products = list(db.products.find(query).sort(sort_by).skip(skip).limit(limit))
        total = db.products.count_documents(query)
        
        return {
            'products': [Product.format_product(p) for p in products],
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }
    
    @staticmethod
    def find_by_id(product_id):
        """Find product by ID"""
        db = get_db()
        product = db.products.find_one({'_id': ObjectId(product_id)})
        return Product.format_product(product) if product else None
    
    @staticmethod
    def find_by_slug(slug):
        """Find product by slug"""
        db = get_db()
        product = db.products.find_one({'slug': slug})
        return Product.format_product(product) if product else None
    
    @staticmethod
    def update(product_id, update_data):
        """Update product"""
        db = get_db()
        
        update_data['updatedAt'] = datetime.utcnow()
        
        db.products.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': update_data}
        )
        
        return Product.find_by_id(product_id)
    
    @staticmethod
    def delete(product_id):
        """Delete product (soft delete)"""
        db = get_db()
        
        db.products.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': {'isActive': False, 'updatedAt': datetime.utcnow()}}
        )
        
        return True
    
    @staticmethod
    def update_rating(product_id, new_rating, increment=True):
        """Update product rating"""
        db = get_db()
        product = db.products.find_one({'_id': ObjectId(product_id)})
        
        if not product:
            return None
        
        total_reviews = product.get('totalReviews', 0)
        avg_rating = product.get('averageRating', 0)
        
        if increment:
            new_total = total_reviews + 1
            new_avg = ((avg_rating * total_reviews) + new_rating) / new_total
        else:
            new_total = max(0, total_reviews - 1)
            if new_total > 0:
                new_avg = ((avg_rating * total_reviews) - new_rating) / new_total
            else:
                new_avg = 0
        
        db.products.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': {
                'averageRating': round(new_avg, 2),
                'totalReviews': new_total,
                'updatedAt': datetime.utcnow()
            }}
        )
        
        return Product.find_by_id(product_id)
    
    @staticmethod
    def update_stock(product_id, quantity):
        """Update product stock"""
        db = get_db()
        
        db.products.update_one(
            {'_id': ObjectId(product_id)},
            {'$inc': {'stock': quantity}, '$set': {'updatedAt': datetime.utcnow()}}
        )
        
        return Product.find_by_id(product_id)
    
    @staticmethod
    def search(query, page=1, limit=20):
        """Search products by text"""
        db = get_db()
        
        skip = (page - 1) * limit
        
        # Text search
        products = list(db.products.find(
            {'$text': {'$search': query}, 'isActive': True}
        ).skip(skip).limit(limit))
        
        total = len(products)
        
        return {
            'products': [Product.format_product(p) for p in products],
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }
    
    @staticmethod
    def format_product(product):
        """Format product object for response"""
        if not product:
            return None
        
        return {
            'id': str(product['_id']),
            'name': product['name'],
            'slug': product['slug'],
            'description': product['description'],
            'price': product['price'],
            'compareAtPrice': product.get('compareAtPrice'),
            'images': product.get('images', []),
            'category': product['category'],
            'tags': product.get('tags', []),
            'stock': product.get('stock', 0),
            'sku': product.get('sku'),
            'nutritionFacts': product.get('nutritionFacts', {}),
            'ingredients': product.get('ingredients', []),
            'averageRating': product.get('averageRating', 0),
            'totalReviews': product.get('totalReviews', 0),
            'isActive': product.get('isActive', True),
            'createdAt': product['createdAt'].isoformat() if product.get('createdAt') else None
        }
