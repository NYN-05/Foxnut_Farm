from database.db import get_db
from bson.objectid import ObjectId
from datetime import datetime
import random
import string

class Order:
    """Order model for managing orders"""
    
    @staticmethod
    def generate_order_number():
        """Generate unique order number"""
        timestamp = datetime.utcnow().strftime('%Y%m%d')
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"FN-{timestamp}-{random_str}"
    
    @staticmethod
    def create(user_id, order_data):
        """Create a new order"""
        db = get_db()
        
        order = {
            'userId': user_id,
            'orderNumber': Order.generate_order_number(),
            'items': order_data['items'],
            'subtotal': order_data['subtotal'],
            'shippingCost': order_data.get('shippingCost', 0),
            'tax': order_data.get('tax', 0),
            'discount': order_data.get('discount', 0),
            'total': order_data['total'],
            'shippingAddress': order_data['shippingAddress'],
            'billingAddress': order_data.get('billingAddress', order_data['shippingAddress']),
            'paymentMethod': order_data['paymentMethod'],
            'paymentStatus': 'pending',
            'orderStatus': 'pending',
            'stripePaymentIntentId': order_data.get('stripePaymentIntentId'),
            'trackingNumber': None,
            'notes': order_data.get('notes'),
            'statusHistory': [{
                'status': 'pending',
                'timestamp': datetime.utcnow(),
                'note': 'Order placed'
            }],
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        result = db.orders.insert_one(order)
        order['_id'] = result.inserted_id
        
        return Order.format_order(order)
    
    @staticmethod
    def find_by_id(order_id):
        """Find order by ID"""
        db = get_db()
        order = db.orders.find_one({'_id': ObjectId(order_id)})
        return Order.format_order(order) if order else None
    
    @staticmethod
    def find_by_order_number(order_number):
        """Find order by order number"""
        db = get_db()
        order = db.orders.find_one({'orderNumber': order_number})
        return Order.format_order(order) if order else None
    
    @staticmethod
    def find_by_user(user_id, page=1, limit=10):
        """Find orders by user ID"""
        db = get_db()
        
        skip = (page - 1) * limit
        
        orders = list(db.orders.find(
            {'userId': user_id}
        ).sort('createdAt', -1).skip(skip).limit(limit))
        
        total = db.orders.count_documents({'userId': user_id})
        
        return {
            'orders': [Order.format_order(o) for o in orders],
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }
    
    @staticmethod
    def find_all(filters=None, page=1, limit=20):
        """Find all orders with pagination"""
        db = get_db()
        
        query = filters or {}
        skip = (page - 1) * limit
        
        orders = list(db.orders.find(query).sort('createdAt', -1).skip(skip).limit(limit))
        total = db.orders.count_documents(query)
        
        return {
            'orders': [Order.format_order(o) for o in orders],
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        }
    
    @staticmethod
    def update_status(order_id, status, note=None):
        """Update order status"""
        db = get_db()
        
        status_update = {
            'status': status,
            'timestamp': datetime.utcnow(),
            'note': note
        }
        
        db.orders.update_one(
            {'_id': ObjectId(order_id)},
            {
                '$set': {
                    'orderStatus': status,
                    'updatedAt': datetime.utcnow()
                },
                '$push': {'statusHistory': status_update}
            }
        )
        
        return Order.find_by_id(order_id)
    
    @staticmethod
    def update_payment_status(order_id, payment_status):
        """Update payment status"""
        db = get_db()
        
        db.orders.update_one(
            {'_id': ObjectId(order_id)},
            {'$set': {
                'paymentStatus': payment_status,
                'updatedAt': datetime.utcnow()
            }}
        )
        
        return Order.find_by_id(order_id)
    
    @staticmethod
    def add_tracking(order_id, tracking_number, carrier=None):
        """Add tracking information"""
        db = get_db()
        
        db.orders.update_one(
            {'_id': ObjectId(order_id)},
            {'$set': {
                'trackingNumber': tracking_number,
                'trackingCarrier': carrier,
                'updatedAt': datetime.utcnow()
            }}
        )
        
        return Order.find_by_id(order_id)
    
    @staticmethod
    def format_order(order):
        """Format order object for response"""
        if not order:
            return None
        
        return {
            'id': str(order['_id']),
            'userId': order['userId'],
            'orderNumber': order['orderNumber'],
            'items': order['items'],
            'subtotal': order['subtotal'],
            'shippingCost': order.get('shippingCost', 0),
            'tax': order.get('tax', 0),
            'discount': order.get('discount', 0),
            'total': order['total'],
            'shippingAddress': order['shippingAddress'],
            'billingAddress': order.get('billingAddress'),
            'paymentMethod': order['paymentMethod'],
            'paymentStatus': order['paymentStatus'],
            'orderStatus': order['orderStatus'],
            'trackingNumber': order.get('trackingNumber'),
            'trackingCarrier': order.get('trackingCarrier'),
            'notes': order.get('notes'),
            'statusHistory': order.get('statusHistory', []),
            'createdAt': order['createdAt'].isoformat() if order.get('createdAt') else None,
            'updatedAt': order['updatedAt'].isoformat() if order.get('updatedAt') else None
        }
