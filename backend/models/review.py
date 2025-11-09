from database.db import get_db
from bson.objectid import ObjectId
from datetime import datetime

class Review:
    """Review model for managing product reviews"""
    
    @staticmethod
    def create(user_id, product_id, review_data):
        """Create a new review"""
        db = get_db()
        
        # Check if user already reviewed this product
        existing = db.reviews.find_one({
            'userId': user_id,
            'productId': product_id
        })
        
        if existing:
            raise ValueError('You have already reviewed this product')
        
        review = {
            'userId': user_id,
            'productId': product_id,
            'rating': review_data['rating'],
            'title': review_data.get('title'),
            'comment': review_data.get('comment'),
            'isVerified': review_data.get('isVerified', False),
            'helpful': 0,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        result = db.reviews.insert_one(review)
        review['_id'] = result.inserted_id
        
        return Review.format_review(review)
    
    @staticmethod
    def find_by_product(product_id, page=1, limit=10):
        """Find reviews by product ID"""
        db = get_db()
        
        skip = (page - 1) * limit
        
        reviews = list(db.reviews.find(
            {'productId': product_id}
        ).sort('createdAt', -1).skip(skip).limit(limit))
        
        total = db.reviews.count_documents({'productId': product_id})
        
        # Get user info for each review
        formatted_reviews = []
        for review in reviews:
            user = db.users.find_one({'_id': ObjectId(review['userId'])})
            formatted_review = Review.format_review(review)
            formatted_review['userName'] = user['name'] if user else 'Anonymous'
            formatted_reviews.append(formatted_review)
        
        return {
            'reviews': formatted_reviews,
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }
    
    @staticmethod
    def find_by_user(user_id, page=1, limit=10):
        """Find reviews by user ID"""
        db = get_db()
        
        skip = (page - 1) * limit
        
        reviews = list(db.reviews.find(
            {'userId': user_id}
        ).sort('createdAt', -1).skip(skip).limit(limit))
        
        total = db.reviews.count_documents({'userId': user_id})
        
        # Get product info for each review
        formatted_reviews = []
        for review in reviews:
            product = db.products.find_one({'_id': ObjectId(review['productId'])})
            formatted_review = Review.format_review(review)
            formatted_review['productName'] = product['name'] if product else 'Unknown'
            formatted_reviews.append(formatted_review)
        
        return {
            'reviews': formatted_reviews,
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }
    
    @staticmethod
    def find_by_id(review_id):
        """Find review by ID"""
        db = get_db()
        review = db.reviews.find_one({'_id': ObjectId(review_id)})
        return Review.format_review(review) if review else None
    
    @staticmethod
    def update(review_id, user_id, update_data):
        """Update review"""
        db = get_db()
        
        # Verify ownership
        review = db.reviews.find_one({'_id': ObjectId(review_id)})
        if not review or review['userId'] != user_id:
            raise ValueError('Unauthorized to update this review')
        
        update_data['updatedAt'] = datetime.utcnow()
        
        db.reviews.update_one(
            {'_id': ObjectId(review_id)},
            {'$set': update_data}
        )
        
        return Review.find_by_id(review_id)
    
    @staticmethod
    def delete(review_id, user_id):
        """Delete review"""
        db = get_db()
        
        # Verify ownership
        review = db.reviews.find_one({'_id': ObjectId(review_id)})
        if not review or review['userId'] != user_id:
            raise ValueError('Unauthorized to delete this review')
        
        db.reviews.delete_one({'_id': ObjectId(review_id)})
        return True
    
    @staticmethod
    def mark_helpful(review_id):
        """Mark review as helpful"""
        db = get_db()
        
        db.reviews.update_one(
            {'_id': ObjectId(review_id)},
            {'$inc': {'helpful': 1}}
        )
        
        return Review.find_by_id(review_id)
    
    @staticmethod
    def format_review(review):
        """Format review object for response"""
        if not review:
            return None
        
        return {
            'id': str(review['_id']),
            'userId': review['userId'],
            'productId': review['productId'],
            'rating': review['rating'],
            'title': review.get('title'),
            'comment': review.get('comment'),
            'isVerified': review.get('isVerified', False),
            'helpful': review.get('helpful', 0),
            'createdAt': review['createdAt'].isoformat() if review.get('createdAt') else None,
            'updatedAt': review['updatedAt'].isoformat() if review.get('updatedAt') else None
        }
