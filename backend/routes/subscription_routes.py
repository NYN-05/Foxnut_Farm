from flask import Blueprint, request, jsonify
from middleware.auth_middleware import token_required
from database.db import get_db
from datetime import datetime, timedelta
from bson.objectid import ObjectId

subscription_bp = Blueprint('subscriptions', __name__)

@subscription_bp.route('/', methods=['GET'])
@token_required
def get_user_subscriptions(current_user):
    """Get user's subscriptions"""
    try:
        db = get_db()
        
        subscriptions = list(db.subscriptions.find({
            'userId': str(current_user['_id'])
        }).sort('createdAt', -1))
        
        formatted = []
        for sub in subscriptions:
            # Get product info
            product = db.products.find_one({'_id': ObjectId(sub['productId'])})
            
            formatted.append({
                'id': str(sub['_id']),
                'productId': sub['productId'],
                'productName': product['name'] if product else 'Unknown',
                'quantity': sub['quantity'],
                'frequency': sub['frequency'],
                'price': sub['price'],
                'status': sub['status'],
                'nextDelivery': sub.get('nextDelivery').isoformat() if sub.get('nextDelivery') else None,
                'createdAt': sub['createdAt'].isoformat()
            })
        
        return jsonify({
            'subscriptions': formatted
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch subscriptions'}), 500

@subscription_bp.route('/', methods=['POST'])
@token_required
def create_subscription(current_user):
    """Create new subscription"""
    try:
        data = request.get_json()
        
        required = ['productId', 'quantity', 'frequency']
        missing = [field for field in required if field not in data]
        if missing:
            return jsonify({
                'error': 'Missing required fields',
                'fields': missing
            }), 400
        
        db = get_db()
        
        # Verify product
        product = db.products.find_one({'_id': ObjectId(data['productId'])})
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Calculate next delivery
        frequency_days = {
            'weekly': 7,
            'biweekly': 14,
            'monthly': 30
        }
        
        days = frequency_days.get(data['frequency'], 30)
        next_delivery = datetime.utcnow() + timedelta(days=days)
        
        subscription = {
            'userId': str(current_user['_id']),
            'productId': data['productId'],
            'quantity': data['quantity'],
            'frequency': data['frequency'],
            'price': product['price'],
            'status': 'active',
            'nextDelivery': next_delivery,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        result = db.subscriptions.insert_one(subscription)
        subscription['_id'] = result.inserted_id
        
        return jsonify({
            'message': 'Subscription created successfully',
            'subscription': {
                'id': str(subscription['_id']),
                'productId': subscription['productId'],
                'quantity': subscription['quantity'],
                'frequency': subscription['frequency'],
                'nextDelivery': subscription['nextDelivery'].isoformat()
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to create subscription'}), 500

@subscription_bp.route('/<subscription_id>', methods=['PUT'])
@token_required
def update_subscription(current_user, subscription_id):
    """Update subscription"""
    try:
        data = request.get_json()
        
        db = get_db()
        
        # Verify ownership
        subscription = db.subscriptions.find_one({
            '_id': ObjectId(subscription_id),
            'userId': str(current_user['_id'])
        })
        
        if not subscription:
            return jsonify({'error': 'Subscription not found'}), 404
        
        update_data = {}
        
        if 'quantity' in data:
            update_data['quantity'] = data['quantity']
        
        if 'frequency' in data:
            update_data['frequency'] = data['frequency']
            # Recalculate next delivery
            frequency_days = {
                'weekly': 7,
                'biweekly': 14,
                'monthly': 30
            }
            days = frequency_days.get(data['frequency'], 30)
            update_data['nextDelivery'] = datetime.utcnow() + timedelta(days=days)
        
        update_data['updatedAt'] = datetime.utcnow()
        
        db.subscriptions.update_one(
            {'_id': ObjectId(subscription_id)},
            {'$set': update_data}
        )
        
        return jsonify({
            'message': 'Subscription updated successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update subscription'}), 500

@subscription_bp.route('/<subscription_id>/pause', methods=['POST'])
@token_required
def pause_subscription(current_user, subscription_id):
    """Pause subscription"""
    try:
        db = get_db()
        
        result = db.subscriptions.update_one(
            {
                '_id': ObjectId(subscription_id),
                'userId': str(current_user['_id'])
            },
            {'$set': {
                'status': 'paused',
                'updatedAt': datetime.utcnow()
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Subscription not found'}), 404
        
        return jsonify({
            'message': 'Subscription paused successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to pause subscription'}), 500

@subscription_bp.route('/<subscription_id>/resume', methods=['POST'])
@token_required
def resume_subscription(current_user, subscription_id):
    """Resume subscription"""
    try:
        db = get_db()
        
        result = db.subscriptions.update_one(
            {
                '_id': ObjectId(subscription_id),
                'userId': str(current_user['_id'])
            },
            {'$set': {
                'status': 'active',
                'updatedAt': datetime.utcnow()
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Subscription not found'}), 404
        
        return jsonify({
            'message': 'Subscription resumed successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to resume subscription'}), 500

@subscription_bp.route('/<subscription_id>', methods=['DELETE'])
@token_required
def cancel_subscription(current_user, subscription_id):
    """Cancel subscription"""
    try:
        db = get_db()
        
        result = db.subscriptions.update_one(
            {
                '_id': ObjectId(subscription_id),
                'userId': str(current_user['_id'])
            },
            {'$set': {
                'status': 'cancelled',
                'cancelledAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow()
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Subscription not found'}), 404
        
        return jsonify({
            'message': 'Subscription cancelled successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to cancel subscription'}), 500
