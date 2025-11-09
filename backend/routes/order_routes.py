from flask import Blueprint, request, jsonify
from models.order import Order
from models.product import Product
from middleware.auth_middleware import token_required, admin_required
from middleware.validators import validate_order_data
from database.db import get_db

order_bp = Blueprint('orders', __name__)

@order_bp.route('/', methods=['POST'])
@token_required
@validate_order_data
def create_order(current_user):
    """Create new order"""
    try:
        data = request.get_json()
        
        # Verify stock for all items
        for item in data['items']:
            product = Product.find_by_id(item['productId'])
            if not product:
                return jsonify({'error': f"Product {item['productId']} not found"}), 404
            if product['stock'] < item['quantity']:
                return jsonify({
                    'error': f"Insufficient stock for {product['name']}"
                }), 400
        
        # Calculate totals
        subtotal = sum(item['price'] * item['quantity'] for item in data['items'])
        shipping = data.get('shippingCost', 5.99)
        tax = subtotal * 0.08  # 8% tax
        total = subtotal + shipping + tax
        
        order_data = {
            'items': data['items'],
            'subtotal': subtotal,
            'shippingCost': shipping,
            'tax': tax,
            'total': total,
            'shippingAddress': data['shippingAddress'],
            'billingAddress': data.get('billingAddress'),
            'paymentMethod': data['paymentMethod'],
            'notes': data.get('notes')
        }
        
        order = Order.create(str(current_user['_id']), order_data)
        
        # Update product stock
        for item in data['items']:
            Product.update_stock(item['productId'], -item['quantity'])
        
        # Clear user's cart
        db = get_db()
        db.carts.update_one(
            {'userId': str(current_user['_id'])},
            {'$set': {'items': [], 'total': 0}}
        )
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_bp.route('/', methods=['GET'])
@token_required
def get_user_orders(current_user):
    """Get user's orders"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        
        result = Order.find_by_user(str(current_user['_id']), page, limit)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch orders'}), 500

@order_bp.route('/<order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    """Get single order"""
    try:
        order = Order.find_by_id(order_id)
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Verify ownership
        if order['userId'] != str(current_user['_id']) and current_user.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        
        return jsonify(order), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch order'}), 500

@order_bp.route('/track/<order_number>', methods=['GET'])
def track_order(order_number):
    """Track order by order number (public)"""
    try:
        order = Order.find_by_order_number(order_number)
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Return limited info for tracking
        return jsonify({
            'orderNumber': order['orderNumber'],
            'orderStatus': order['orderStatus'],
            'trackingNumber': order.get('trackingNumber'),
            'trackingCarrier': order.get('trackingCarrier'),
            'statusHistory': order.get('statusHistory', []),
            'createdAt': order['createdAt']
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to track order'}), 500

@order_bp.route('/<order_id>/cancel', methods=['POST'])
@token_required
def cancel_order(current_user, order_id):
    """Cancel order"""
    try:
        order = Order.find_by_id(order_id)
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Verify ownership
        if order['userId'] != str(current_user['_id']):
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Check if order can be cancelled
        if order['orderStatus'] not in ['pending', 'processing']:
            return jsonify({
                'error': 'Order cannot be cancelled at this stage'
            }), 400
        
        # Update status
        updated_order = Order.update_status(order_id, 'cancelled', 'Cancelled by customer')
        
        # Restore product stock
        for item in order['items']:
            Product.update_stock(item['productId'], item['quantity'])
        
        return jsonify({
            'message': 'Order cancelled successfully',
            'order': updated_order
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to cancel order'}), 500

@order_bp.route('/admin', methods=['GET'])
@admin_required
def get_all_orders(current_user):
    """Get all orders (admin only)"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        status = request.args.get('status')
        
        filters = {}
        if status:
            filters['orderStatus'] = status
        
        result = Order.find_all(filters, page, limit)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch orders'}), 500

@order_bp.route('/<order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(current_user, order_id):
    """Update order status (admin only)"""
    try:
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        updated_order = Order.update_status(
            order_id,
            data['status'],
            data.get('note')
        )
        
        if not updated_order:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({
            'message': 'Order status updated',
            'order': updated_order
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update order status'}), 500

@order_bp.route('/<order_id>/tracking', methods=['PUT'])
@admin_required
def add_tracking(current_user, order_id):
    """Add tracking information (admin only)"""
    try:
        data = request.get_json()
        
        if 'trackingNumber' not in data:
            return jsonify({'error': 'Tracking number is required'}), 400
        
        updated_order = Order.add_tracking(
            order_id,
            data['trackingNumber'],
            data.get('carrier')
        )
        
        if not updated_order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Auto-update status to shipped
        Order.update_status(order_id, 'shipped', 'Tracking number added')
        
        return jsonify({
            'message': 'Tracking information added',
            'order': updated_order
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to add tracking'}), 500
