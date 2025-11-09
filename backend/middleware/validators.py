from functools import wraps
from flask import request, jsonify
import re

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    return True, None

def validate_phone(phone):
    """Validate phone number format"""
    pattern = r'^\+?1?\d{9,15}$'
    return re.match(pattern, phone) is not None

def validate_required_fields(required_fields):
    """Decorator to validate required fields in request"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'Request body required'}), 400
            
            missing_fields = []
            for field in required_fields:
                if field not in data or not data[field]:
                    missing_fields.append(field)
            
            if missing_fields:
                return jsonify({
                    'error': 'Missing required fields',
                    'fields': missing_fields
                }), 400
            
            return f(*args, **kwargs)
        
        return decorated
    return decorator

def validate_registration_data(f):
    """Decorator to validate registration data"""
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body required'}), 400
        
        # Check required fields
        required = ['email', 'password', 'name']
        missing = [field for field in required if field not in data or not data[field]]
        if missing:
            return jsonify({
                'error': 'Missing required fields',
                'fields': missing
            }), 400
        
        # Validate email
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password
        valid, message = validate_password(data['password'])
        if not valid:
            return jsonify({'error': message}), 400
        
        # Validate phone if provided
        if 'phone' in data and data['phone']:
            if not validate_phone(data['phone']):
                return jsonify({'error': 'Invalid phone number format'}), 400
        
        return f(*args, **kwargs)
    
    return decorated

def validate_product_data(f):
    """Decorator to validate product data"""
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body required'}), 400
        
        # Check required fields
        required = ['name', 'slug', 'description', 'price', 'category']
        missing = [field for field in required if field not in data or not data[field]]
        if missing:
            return jsonify({
                'error': 'Missing required fields',
                'fields': missing
            }), 400
        
        # Validate price
        try:
            price = float(data['price'])
            if price < 0:
                return jsonify({'error': 'Price must be positive'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid price format'}), 400
        
        # Validate stock if provided
        if 'stock' in data:
            try:
                stock = int(data['stock'])
                if stock < 0:
                    return jsonify({'error': 'Stock must be non-negative'}), 400
            except (ValueError, TypeError):
                return jsonify({'error': 'Invalid stock format'}), 400
        
        return f(*args, **kwargs)
    
    return decorated

def validate_review_data(f):
    """Decorator to validate review data"""
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body required'}), 400
        
        # Check required fields
        if 'rating' not in data:
            return jsonify({'error': 'Rating is required'}), 400
        
        # Validate rating
        try:
            rating = int(data['rating'])
            if rating < 1 or rating > 5:
                return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid rating format'}), 400
        
        return f(*args, **kwargs)
    
    return decorated

def validate_order_data(f):
    """Decorator to validate order data"""
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body required'}), 400
        
        # Check required fields
        required = ['items', 'shippingAddress', 'paymentMethod']
        missing = [field for field in required if field not in data or not data[field]]
        if missing:
            return jsonify({
                'error': 'Missing required fields',
                'fields': missing
            }), 400
        
        # Validate items
        if not isinstance(data['items'], list) or len(data['items']) == 0:
            return jsonify({'error': 'Order must contain at least one item'}), 400
        
        # Validate shipping address
        address_required = ['street', 'city', 'state', 'zipCode', 'country']
        missing_address = [
            field for field in address_required 
            if field not in data['shippingAddress'] or not data['shippingAddress'][field]
        ]
        if missing_address:
            return jsonify({
                'error': 'Incomplete shipping address',
                'fields': missing_address
            }), 400
        
        return f(*args, **kwargs)
    
    return decorated
