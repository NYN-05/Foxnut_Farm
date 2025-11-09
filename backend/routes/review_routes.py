from flask import Blueprint, request, jsonify
from models.review import Review
from models.product import Product
from middleware.auth_middleware import token_required, optional_token
from middleware.validators import validate_review_data

review_bp = Blueprint('reviews', __name__)

@review_bp.route('/product/<product_id>', methods=['GET'])
@optional_token
def get_product_reviews(current_user, product_id):
    """Get reviews for a product"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        
        result = Review.find_by_product(product_id, page, limit)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch reviews'}), 500

@review_bp.route('/user', methods=['GET'])
@token_required
def get_user_reviews(current_user):
    """Get user's reviews"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        
        result = Review.find_by_user(str(current_user['_id']), page, limit)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch reviews'}), 500

@review_bp.route('/', methods=['POST'])
@token_required
@validate_review_data
def create_review(current_user):
    """Create a new review"""
    try:
        data = request.get_json()
        
        if 'productId' not in data:
            return jsonify({'error': 'Product ID is required'}), 400
        
        # Verify product exists
        product = Product.find_by_id(data['productId'])
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        review = Review.create(
            str(current_user['_id']),
            data['productId'],
            data
        )
        
        # Update product rating
        Product.update_rating(data['productId'], data['rating'], increment=True)
        
        return jsonify({
            'message': 'Review created successfully',
            'review': review
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 409
    except Exception as e:
        return jsonify({'error': 'Failed to create review'}), 500

@review_bp.route('/<review_id>', methods=['PUT'])
@token_required
@validate_review_data
def update_review(current_user, review_id):
    """Update a review"""
    try:
        data = request.get_json()
        
        # Get old review to update product rating
        old_review = Review.find_by_id(review_id)
        if not old_review:
            return jsonify({'error': 'Review not found'}), 404
        
        updated_review = Review.update(
            review_id,
            str(current_user['_id']),
            data
        )
        
        # Update product rating if rating changed
        if 'rating' in data and data['rating'] != old_review['rating']:
            # Remove old rating
            Product.update_rating(
                old_review['productId'],
                old_review['rating'],
                increment=False
            )
            # Add new rating
            Product.update_rating(
                old_review['productId'],
                data['rating'],
                increment=True
            )
        
        return jsonify({
            'message': 'Review updated successfully',
            'review': updated_review
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 403
    except Exception as e:
        return jsonify({'error': 'Failed to update review'}), 500

@review_bp.route('/<review_id>', methods=['DELETE'])
@token_required
def delete_review(current_user, review_id):
    """Delete a review"""
    try:
        # Get review to update product rating
        review = Review.find_by_id(review_id)
        if not review:
            return jsonify({'error': 'Review not found'}), 404
        
        Review.delete(review_id, str(current_user['_id']))
        
        # Update product rating
        Product.update_rating(
            review['productId'],
            review['rating'],
            increment=False
        )
        
        return jsonify({
            'message': 'Review deleted successfully'
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 403
    except Exception as e:
        return jsonify({'error': 'Failed to delete review'}), 500

@review_bp.route('/<review_id>/helpful', methods=['POST'])
def mark_helpful(review_id):
    """Mark review as helpful"""
    try:
        updated_review = Review.mark_helpful(review_id)
        
        if not updated_review:
            return jsonify({'error': 'Review not found'}), 404
        
        return jsonify({
            'message': 'Review marked as helpful',
            'review': updated_review
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to mark review'}), 500
