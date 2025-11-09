from flask import Blueprint, request, jsonify
from database.db import get_db
from datetime import datetime
import re

newsletter_bp = Blueprint('newsletter', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@newsletter_bp.route('/subscribe', methods=['POST'])
def subscribe():
    """Subscribe to newsletter"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        email = data['email'].lower().strip()
        
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        db = get_db()
        
        # Check if already subscribed
        existing = db.newsletter.find_one({'email': email})
        if existing:
            if existing.get('isActive'):
                return jsonify({'message': 'Already subscribed to newsletter'}), 200
            else:
                # Reactivate subscription
                db.newsletter.update_one(
                    {'email': email},
                    {'$set': {
                        'isActive': True,
                        'updatedAt': datetime.utcnow()
                    }}
                )
                return jsonify({'message': 'Newsletter subscription reactivated'}), 200
        
        # Create new subscription
        subscription = {
            'email': email,
            'name': data.get('name'),
            'isActive': True,
            'subscribedAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        db.newsletter.insert_one(subscription)
        
        return jsonify({
            'message': 'Successfully subscribed to newsletter'
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to subscribe'}), 500

@newsletter_bp.route('/unsubscribe', methods=['POST'])
def unsubscribe():
    """Unsubscribe from newsletter"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        email = data['email'].lower().strip()
        
        db = get_db()
        
        result = db.newsletter.update_one(
            {'email': email},
            {'$set': {
                'isActive': False,
                'unsubscribedAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow()
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Email not found in newsletter'}), 404
        
        return jsonify({
            'message': 'Successfully unsubscribed from newsletter'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to unsubscribe'}), 500

@newsletter_bp.route('/subscribers', methods=['GET'])
def get_subscribers():
    """Get all active subscribers (admin endpoint - should add auth)"""
    try:
        db = get_db()
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        skip = (page - 1) * limit
        
        subscribers = list(db.newsletter.find(
            {'isActive': True}
        ).skip(skip).limit(limit))
        
        total = db.newsletter.count_documents({'isActive': True})
        
        return jsonify({
            'subscribers': [
                {
                    'email': s['email'],
                    'name': s.get('name'),
                    'subscribedAt': s['subscribedAt'].isoformat()
                }
                for s in subscribers
            ],
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch subscribers'}), 500
