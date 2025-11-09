from flask import Blueprint, request, jsonify
from models.product import Product
from middleware.auth_middleware import admin_required, optional_token
from middleware.validators import validate_product_data

product_bp = Blueprint('products', __name__)

@product_bp.route('/', methods=['GET'])
@optional_token
def get_products(current_user):
    """Get all products with filters and pagination"""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        category = request.args.get('category')
        min_price = request.args.get('minPrice')
        max_price = request.args.get('maxPrice')
        tags = request.args.get('tags')
        sort_by = request.args.get('sortBy', 'createdAt')
        sort_order = request.args.get('sortOrder', 'desc')
        search = request.args.get('search')
        
        # Build filters
        filters = {'isActive': True}
        
        if category:
            filters['category'] = category
        
        if min_price or max_price:
            filters['price'] = {}
            if min_price:
                filters['price']['$gte'] = float(min_price)
            if max_price:
                filters['price']['$lte'] = float(max_price)
        
        if tags:
            tag_list = tags.split(',')
            filters['tags'] = {'$in': tag_list}
        
        # Build sort
        sort = [(sort_by, -1 if sort_order == 'desc' else 1)]
        
        # Search or filter
        if search:
            result = Product.search(search, page, limit)
        else:
            result = Product.find_all(filters, page, limit, sort)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch products'}), 500

@product_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        product = Product.find_by_id(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify(product), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch product'}), 500

@product_bp.route('/slug/<slug>', methods=['GET'])
def get_product_by_slug(slug):
    """Get single product by slug"""
    try:
        product = Product.find_by_slug(slug)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify(product), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch product'}), 500

@product_bp.route('/', methods=['POST'])
@admin_required
@validate_product_data
def create_product(current_user):
    """Create new product (admin only)"""
    try:
        data = request.get_json()
        
        product = Product.create(data)
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 409
    except Exception as e:
        return jsonify({'error': 'Failed to create product'}), 500

@product_bp.route('/<product_id>', methods=['PUT'])
@admin_required
def update_product(current_user, product_id):
    """Update product (admin only)"""
    try:
        data = request.get_json()
        
        product = Product.update(product_id, data)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update product'}), 500

@product_bp.route('/<product_id>', methods=['DELETE'])
@admin_required
def delete_product(current_user, product_id):
    """Delete product (admin only - soft delete)"""
    try:
        success = Product.delete(product_id)
        
        if not success:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({
            'message': 'Product deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to delete product'}), 500

@product_bp.route('/<product_id>/stock', methods=['PUT'])
@admin_required
def update_stock(current_user, product_id):
    """Update product stock (admin only)"""
    try:
        data = request.get_json()
        
        if 'quantity' not in data:
            return jsonify({'error': 'Quantity is required'}), 400
        
        product = Product.update_stock(product_id, int(data['quantity']))
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({
            'message': 'Stock updated successfully',
            'product': product
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update stock'}), 500

@product_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    try:
        from database.db import get_db
        db = get_db()
        
        categories = db.products.distinct('category', {'isActive': True})
        
        return jsonify({
            'categories': categories
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch categories'}), 500

@product_bp.route('/tags', methods=['GET'])
def get_tags():
    """Get all product tags"""
    try:
        from database.db import get_db
        db = get_db()
        
        # Get all unique tags
        tags = db.products.distinct('tags', {'isActive': True})
        
        return jsonify({
            'tags': tags
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch tags'}), 500
