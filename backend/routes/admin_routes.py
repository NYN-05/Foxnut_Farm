from flask import Blueprint, request, jsonify
from middleware.auth_middleware import admin_required
from database.db import get_db
from datetime import datetime, timedelta
from bson.objectid import ObjectId

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def get_dashboard(current_user):
    """Get admin dashboard statistics"""
    try:
        db = get_db()
        
        # Total users
        total_users = db.users.count_documents({})
        
        # Total products
        total_products = db.products.count_documents({'isActive': True})
        
        # Total orders
        total_orders = db.orders.count_documents({})
        
        # Total revenue
        revenue_pipeline = [
            {'$match': {'paymentStatus': 'paid'}},
            {'$group': {'_id': None, 'total': {'$sum': '$total'}}}
        ]
        revenue_result = list(db.orders.aggregate(revenue_pipeline))
        total_revenue = revenue_result[0]['total'] if revenue_result else 0
        
        # Orders by status
        status_pipeline = [
            {'$group': {'_id': '$orderStatus', 'count': {'$sum': 1}}}
        ]
        orders_by_status = list(db.orders.aggregate(status_pipeline))
        
        # Recent orders (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_orders = db.orders.count_documents({
            'createdAt': {'$gte': thirty_days_ago}
        })
        
        # Top products
        top_products_pipeline = [
            {'$unwind': '$items'},
            {'$group': {
                '_id': '$items.productId',
                'totalSold': {'$sum': '$items.quantity'},
                'revenue': {'$sum': {'$multiply': ['$items.price', '$items.quantity']}}
            }},
            {'$sort': {'totalSold': -1}},
            {'$limit': 5}
        ]
        top_products = list(db.orders.aggregate(top_products_pipeline))
        
        # Get product names
        for product in top_products:
            product_doc = db.products.find_one({'_id': ObjectId(product['_id'])})
            product['name'] = product_doc['name'] if product_doc else 'Unknown'
        
        # Newsletter subscribers
        newsletter_subscribers = db.newsletter.count_documents({'isActive': True})
        
        # Active subscriptions
        active_subscriptions = db.subscriptions.count_documents({'status': 'active'})
        
        return jsonify({
            'totalUsers': total_users,
            'totalProducts': total_products,
            'totalOrders': total_orders,
            'totalRevenue': round(total_revenue, 2),
            'ordersByStatus': {item['_id']: item['count'] for item in orders_by_status},
            'recentOrders': recent_orders,
            'topProducts': top_products,
            'newsletterSubscribers': newsletter_subscribers,
            'activeSubscriptions': active_subscriptions
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard data'}), 500

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users(current_user):
    """Get all users"""
    try:
        db = get_db()
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        skip = (page - 1) * limit
        
        users = list(db.users.find({}).skip(skip).limit(limit))
        total = db.users.count_documents({})
        
        from models.user import User
        formatted_users = [User.format_user(user) for user in users]
        
        return jsonify({
            'users': formatted_users,
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch users'}), 500

@admin_bp.route('/users/<user_id>/role', methods=['PUT'])
@admin_required
def update_user_role(current_user, user_id):
    """Update user role"""
    try:
        data = request.get_json()
        
        if 'role' not in data:
            return jsonify({'error': 'Role is required'}), 400
        
        if data['role'] not in ['customer', 'admin']:
            return jsonify({'error': 'Invalid role'}), 400
        
        from models.user import User
        User.update(user_id, {'role': data['role']})
        
        return jsonify({
            'message': 'User role updated successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to update user role'}), 500

@admin_bp.route('/analytics/sales', methods=['GET'])
@admin_required
def get_sales_analytics(current_user):
    """Get sales analytics"""
    try:
        db = get_db()
        
        days = int(request.args.get('days', 30))
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Daily sales
        daily_sales_pipeline = [
            {'$match': {
                'createdAt': {'$gte': start_date},
                'paymentStatus': 'paid'
            }},
            {'$group': {
                '_id': {
                    'year': {'$year': '$createdAt'},
                    'month': {'$month': '$createdAt'},
                    'day': {'$dayOfMonth': '$createdAt'}
                },
                'revenue': {'$sum': '$total'},
                'orders': {'$sum': 1}
            }},
            {'$sort': {'_id': 1}}
        ]
        
        daily_sales = list(db.orders.aggregate(daily_sales_pipeline))
        
        # Category performance
        category_pipeline = [
            {'$match': {
                'createdAt': {'$gte': start_date},
                'paymentStatus': 'paid'
            }},
            {'$unwind': '$items'},
            {'$lookup': {
                'from': 'products',
                'localField': 'items.productId',
                'foreignField': '_id',
                'as': 'product'
            }},
            {'$unwind': '$product'},
            {'$group': {
                '_id': '$product.category',
                'revenue': {'$sum': {'$multiply': ['$items.price', '$items.quantity']}},
                'units': {'$sum': '$items.quantity'}
            }}
        ]
        
        category_performance = list(db.orders.aggregate(category_pipeline))
        
        return jsonify({
            'dailySales': daily_sales,
            'categoryPerformance': category_performance
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch analytics'}), 500

@admin_bp.route('/analytics/customers', methods=['GET'])
@admin_required
def get_customer_analytics(current_user):
    """Get customer analytics"""
    try:
        db = get_db()
        
        # New customers (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        new_customers = db.users.count_documents({
            'createdAt': {'$gte': thirty_days_ago}
        })
        
        # Top customers by spend
        top_customers_pipeline = [
            {'$match': {'paymentStatus': 'paid'}},
            {'$group': {
                '_id': '$userId',
                'totalSpent': {'$sum': '$total'},
                'orderCount': {'$sum': 1}
            }},
            {'$sort': {'totalSpent': -1}},
            {'$limit': 10}
        ]
        
        top_customers = list(db.orders.aggregate(top_customers_pipeline))
        
        # Get customer names
        for customer in top_customers:
            user = db.users.find_one({'_id': ObjectId(customer['_id'])})
            customer['name'] = user['name'] if user else 'Unknown'
            customer['email'] = user['email'] if user else 'Unknown'
        
        # Customer retention (customers with 2+ orders)
        repeat_customers = len(list(db.orders.aggregate([
            {'$group': {
                '_id': '$userId',
                'orderCount': {'$sum': 1}
            }},
            {'$match': {'orderCount': {'$gte': 2}}}
        ])))
        
        total_customers = db.users.count_documents({})
        retention_rate = (repeat_customers / total_customers * 100) if total_customers > 0 else 0
        
        return jsonify({
            'newCustomers': new_customers,
            'topCustomers': top_customers,
            'repeatCustomers': repeat_customers,
            'retentionRate': round(retention_rate, 2)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch customer analytics'}), 500
