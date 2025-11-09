from database.db import get_db
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import jwt
from flask import current_app

class User:
    """User model for authentication and user management"""
    
    @staticmethod
    def create(email, password, name, phone=None):
        """Create a new user"""
        db = get_db()
        
        # Check if user exists
        if db.users.find_one({'email': email}):
            raise ValueError('Email already registered')
        
        user_data = {
            'email': email,
            'password': generate_password_hash(password),
            'name': name,
            'phone': phone,
            'role': 'customer',
            'isVerified': False,
            'addresses': [],
            'wishlist': [],
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        result = db.users.insert_one(user_data)
        user_data['_id'] = result.inserted_id
        return User.format_user(user_data)
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        db = get_db()
        user = db.users.find_one({'email': email})
        return user
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        db = get_db()
        user = db.users.find_one({'_id': ObjectId(user_id)})
        return user
    
    @staticmethod
    def verify_password(stored_password, provided_password):
        """Verify password"""
        return check_password_hash(stored_password, provided_password)
    
    @staticmethod
    def update(user_id, update_data):
        """Update user data"""
        db = get_db()
        update_data['updatedAt'] = datetime.utcnow()
        
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        return User.find_by_id(user_id)
    
    @staticmethod
    def add_address(user_id, address):
        """Add delivery address"""
        db = get_db()
        
        address['id'] = str(ObjectId())
        address['createdAt'] = datetime.utcnow()
        
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$push': {'addresses': address}}
        )
        
        return User.find_by_id(user_id)
    
    @staticmethod
    def update_address(user_id, address_id, address_data):
        """Update delivery address"""
        db = get_db()
        
        db.users.update_one(
            {'_id': ObjectId(user_id), 'addresses.id': address_id},
            {'$set': {
                'addresses.$.street': address_data.get('street'),
                'addresses.$.city': address_data.get('city'),
                'addresses.$.state': address_data.get('state'),
                'addresses.$.zipCode': address_data.get('zipCode'),
                'addresses.$.country': address_data.get('country'),
                'addresses.$.isDefault': address_data.get('isDefault', False)
            }}
        )
        
        return User.find_by_id(user_id)
    
    @staticmethod
    def delete_address(user_id, address_id):
        """Delete delivery address"""
        db = get_db()
        
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$pull': {'addresses': {'id': address_id}}}
        )
        
        return User.find_by_id(user_id)
    
    @staticmethod
    def add_to_wishlist(user_id, product_id):
        """Add product to wishlist"""
        db = get_db()
        
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$addToSet': {'wishlist': product_id}}
        )
        
        return User.find_by_id(user_id)
    
    @staticmethod
    def remove_from_wishlist(user_id, product_id):
        """Remove product from wishlist"""
        db = get_db()
        
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$pull': {'wishlist': product_id}}
        )
        
        return User.find_by_id(user_id)
    
    @staticmethod
    def format_user(user):
        """Format user object for response"""
        if not user:
            return None
        
        return {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'phone': user.get('phone'),
            'role': user['role'],
            'isVerified': user.get('isVerified', False),
            'addresses': user.get('addresses', []),
            'wishlist': user.get('wishlist', []),
            'createdAt': user['createdAt'].isoformat() if user.get('createdAt') else None
        }
    
    @staticmethod
    def generate_token(user_id):
        """Generate JWT token"""
        payload = {
            'user_id': str(user_id),
            'exp': datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }
        
        token = jwt.encode(
            payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
        
        return token
    
    @staticmethod
    def verify_token(token):
        """Verify JWT token"""
        try:
            payload = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
