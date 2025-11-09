from flask import Blueprint, request, jsonify
from middleware.auth_middleware import token_required
from models.user import User
from models.product import Product

wishlist_bp = Blueprint('wishlist', __name__)

@wishlist_bp.route('/', methods=['GET'])
@token_required
def get_wishlist(current_user):
    """Get user's wishlist"""
    try:
        wishlist_ids = current_user.get('wishlist', [])
        
        # Get product details for each item
        products = []
        for product_id in wishlist_ids:
            product = Product.find_by_id(product_id)
            if product:
                products.append(product)
        
        return jsonify({
            'wishlist': products
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch wishlist'}), 500

@wishlist_bp.route('/add/<product_id>', methods=['POST'])
@token_required
def add_to_wishlist(current_user, product_id):
    """Add product to wishlist"""
    try:
        # Verify product exists
        product = Product.find_by_id(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        updated_user = User.add_to_wishlist(str(current_user['_id']), product_id)
        
        return jsonify({
            'message': 'Added to wishlist',
            'wishlist': updated_user.get('wishlist', [])
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to add to wishlist'}), 500

@wishlist_bp.route('/remove/<product_id>', methods=['DELETE'])
@token_required
def remove_from_wishlist(current_user, product_id):
    """Remove product from wishlist"""
    try:
        updated_user = User.remove_from_wishlist(str(current_user['_id']), product_id)
        
        return jsonify({
            'message': 'Removed from wishlist',
            'wishlist': updated_user.get('wishlist', [])
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to remove from wishlist'}), 500

@wishlist_bp.route('/check/<product_id>', methods=['GET'])
@token_required
def check_wishlist(current_user, product_id):
    """Check if product is in wishlist"""
    try:
        wishlist = current_user.get('wishlist', [])
        in_wishlist = product_id in wishlist
        
        return jsonify({
            'inWishlist': in_wishlist
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to check wishlist'}), 500
