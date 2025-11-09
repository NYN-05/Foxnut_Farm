from flask import Blueprint, request, jsonify
from middleware.auth_middleware import token_required
from database.db import get_db
from bson.objectid import ObjectId

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/', methods=['GET'])
@token_required
def get_cart(current_user):
    """Get user's cart"""
    try:
        db = get_db()
        cart = db.carts.find_one({'userId': str(current_user['_id'])})
        
        if not cart:
            return jsonify({
                'items': [],
                'total': 0,
                'itemCount': 0
            }), 200
        
        return jsonify({
            'items': cart.get('items', []),
            'total': cart.get('total', 0),
            'itemCount': len(cart.get('items', []))
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch cart'}), 500

@cart_bp.route('/add', methods=['POST'])
@token_required
def add_to_cart(current_user):
    """Add item to cart"""
    try:
        data = request.get_json()
        
        if 'productId' not in data or 'quantity' not in data:
            return jsonify({'error': 'Product ID and quantity required'}), 400
        
        db = get_db()
        
        # Verify product exists and has stock
        product = db.products.find_one({'_id': ObjectId(data['productId'])})
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        if product.get('stock', 0) < data['quantity']:
            return jsonify({'error': 'Insufficient stock'}), 400
        
        # Get or create cart
        cart = db.carts.find_one({'userId': str(current_user['_id'])})
        
        if not cart:
            cart = {
                'userId': str(current_user['_id']),
                'items': [],
                'total': 0
            }
        
        # Check if item already in cart
        item_found = False
        for item in cart.get('items', []):
            if item['productId'] == data['productId']:
                item['quantity'] += data['quantity']
                item_found = True
                break
        
        # Add new item if not found
        if not item_found:
            cart.setdefault('items', []).append({
                'productId': data['productId'],
                'name': product['name'],
                'price': product['price'],
                'image': product['images'][0]['url'] if product.get('images') else None,
                'quantity': data['quantity']
            })
        
        # Calculate total
        cart['total'] = sum(item['price'] * item['quantity'] for item in cart['items'])
        
        # Update cart
        db.carts.update_one(
            {'userId': str(current_user['_id'])},
            {'$set': cart},
            upsert=True
        )
        
        return jsonify({
            'message': 'Item added to cart',
            'cart': {
                'items': cart['items'],
                'total': cart['total'],
                'itemCount': len(cart['items'])
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to add item to cart'}), 500

@cart_bp.route('/update', methods=['PUT'])
@token_required
def update_cart_item(current_user):
    """Update cart item quantity"""
    try:
        data = request.get_json()
        
        if 'productId' not in data or 'quantity' not in data:
            return jsonify({'error': 'Product ID and quantity required'}), 400
        
        db = get_db()
        cart = db.carts.find_one({'userId': str(current_user['_id'])})
        
        if not cart:
            return jsonify({'error': 'Cart not found'}), 404
        
        # Update item quantity
        for item in cart.get('items', []):
            if item['productId'] == data['productId']:
                item['quantity'] = data['quantity']
                break
        
        # Remove items with 0 quantity
        cart['items'] = [item for item in cart['items'] if item['quantity'] > 0]
        
        # Recalculate total
        cart['total'] = sum(item['price'] * item['quantity'] for item in cart['items'])
        
        # Update cart
        db.carts.update_one(
            {'userId': str(current_user['_id'])},
            {'$set': cart}
        )
        
        return jsonify({
            'message': 'Cart updated',
            'cart': {
                'items': cart['items'],
                'total': cart['total'],
                'itemCount': len(cart['items'])
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update cart'}), 500

@cart_bp.route('/remove/<product_id>', methods=['DELETE'])
@token_required
def remove_from_cart(current_user, product_id):
    """Remove item from cart"""
    try:
        db = get_db()
        cart = db.carts.find_one({'userId': str(current_user['_id'])})
        
        if not cart:
            return jsonify({'error': 'Cart not found'}), 404
        
        # Remove item
        cart['items'] = [item for item in cart['items'] if item['productId'] != product_id]
        
        # Recalculate total
        cart['total'] = sum(item['price'] * item['quantity'] for item in cart['items'])
        
        # Update cart
        db.carts.update_one(
            {'userId': str(current_user['_id'])},
            {'$set': cart}
        )
        
        return jsonify({
            'message': 'Item removed from cart',
            'cart': {
                'items': cart['items'],
                'total': cart['total'],
                'itemCount': len(cart['items'])
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to remove item'}), 500

@cart_bp.route('/clear', methods=['DELETE'])
@token_required
def clear_cart(current_user):
    """Clear entire cart"""
    try:
        db = get_db()
        
        db.carts.update_one(
            {'userId': str(current_user['_id'])},
            {'$set': {
                'items': [],
                'total': 0
            }},
            upsert=True
        )
        
        return jsonify({
            'message': 'Cart cleared',
            'cart': {
                'items': [],
                'total': 0,
                'itemCount': 0
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to clear cart'}), 500
