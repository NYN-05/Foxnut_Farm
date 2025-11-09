from flask import Blueprint, request, jsonify
from models.user import User
from middleware.auth_middleware import token_required
from middleware.validators import validate_registration_data, validate_required_fields

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@validate_registration_data
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        user = User.create(
            email=data['email'],
            password=data['password'],
            name=data['name'],
            phone=data.get('phone')
        )
        
        token = User.generate_token(user['id'])
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user,
            'token': token
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 409
    except Exception as e:
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
@validate_required_fields(['email', 'password'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Find user
        user = User.find_by_email(data['email'])
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Verify password
        if not User.verify_password(user['password'], data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate token
        token = User.generate_token(str(user['_id']))
        
        return jsonify({
            'message': 'Login successful',
            'user': User.format_user(user),
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user profile"""
    try:
        return jsonify({
            'user': User.format_user(current_user)
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user'}), 500

@auth_bp.route('/me', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Update user profile"""
    try:
        data = request.get_json()
        
        # Only allow updating certain fields
        allowed_fields = ['name', 'phone']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        updated_user = User.update(str(current_user['_id']), update_data)
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': User.format_user(updated_user)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update profile'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@token_required
@validate_required_fields(['currentPassword', 'newPassword'])
def change_password(current_user):
    """Change user password"""
    try:
        data = request.get_json()
        
        # Verify current password
        if not User.verify_password(current_user['password'], data['currentPassword']):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Update password
        from werkzeug.security import generate_password_hash
        User.update(str(current_user['_id']), {
            'password': generate_password_hash(data['newPassword'])
        })
        
        return jsonify({
            'message': 'Password changed successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to change password'}), 500

@auth_bp.route('/addresses', methods=['POST'])
@token_required
@validate_required_fields(['street', 'city', 'state', 'zipCode', 'country'])
def add_address(current_user):
    """Add delivery address"""
    try:
        data = request.get_json()
        
        address = {
            'street': data['street'],
            'city': data['city'],
            'state': data['state'],
            'zipCode': data['zipCode'],
            'country': data['country'],
            'isDefault': data.get('isDefault', False)
        }
        
        updated_user = User.add_address(str(current_user['_id']), address)
        
        return jsonify({
            'message': 'Address added successfully',
            'user': User.format_user(updated_user)
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to add address'}), 500

@auth_bp.route('/addresses/<address_id>', methods=['PUT'])
@token_required
def update_address(current_user, address_id):
    """Update delivery address"""
    try:
        data = request.get_json()
        
        updated_user = User.update_address(
            str(current_user['_id']),
            address_id,
            data
        )
        
        return jsonify({
            'message': 'Address updated successfully',
            'user': User.format_user(updated_user)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update address'}), 500

@auth_bp.route('/addresses/<address_id>', methods=['DELETE'])
@token_required
def delete_address(current_user, address_id):
    """Delete delivery address"""
    try:
        updated_user = User.delete_address(str(current_user['_id']), address_id)
        
        return jsonify({
            'message': 'Address deleted successfully',
            'user': User.format_user(updated_user)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to delete address'}), 500
