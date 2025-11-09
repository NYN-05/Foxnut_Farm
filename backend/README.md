# Foxnuts Farm Backend API

Flask-based REST API with MongoDB for the Foxnuts Farm e-commerce platform.

## Tech Stack
- **Backend Framework**: Flask 3.0+
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: AWS S3 / Cloudinary
- **Email Service**: SendGrid
- **Payment Processing**: Stripe
- **CORS**: Flask-CORS

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file in the backend directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/foxnuts_farm?retryWrites=true&w=majority
MONGODB_DB_NAME=foxnuts_farm

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRES=3600  # 1 hour

# Flask
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-flask-secret-key

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=hello@foxnutsfarm.com

# Payment (Stripe)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
FRONTEND_URL=http://localhost:5173
```

### 3. MongoDB Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist your IP address
5. Get connection string and add to `.env`

### 4. Run the Server
```bash
python app.py
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products (with filters, sorting, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter

### Subscription
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions` - Get user's subscriptions
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Cancel subscription

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/users/:id/role` - Update user role

## Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "password": "hashed_password",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer", // customer, admin
  "phone": "+91-1234567890",
  "addresses": [
    {
      "type": "shipping", // shipping, billing
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India",
      "isDefault": true
    }
  ],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Products Collection
```json
{
  "_id": ObjectId,
  "name": "Himalayan Salt Foxnuts",
  "slug": "himalayan-salt-foxnuts",
  "description": "Perfectly roasted...",
  "price": 12.99,
  "compareAtPrice": 15.99,
  "images": [
    {
      "url": "https://cloudinary.com/...",
      "alt": "Product image",
      "isPrimary": true
    }
  ],
  "category": "salty",
  "tags": ["organic", "gluten-free", "vegan"],
  "stock": 100,
  "sku": "FN-HIM-SALT-001",
  "nutritionFacts": {
    "servingSize": "30g",
    "calories": 140,
    "protein": "4g",
    "carbs": "18g",
    "fat": "6g"
  },
  "ingredients": ["Foxnuts", "Himalayan Pink Salt", "Olive Oil"],
  "averageRating": 4.8,
  "totalReviews": 127,
  "isActive": true,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Orders Collection
```json
{
  "_id": ObjectId,
  "orderNumber": "ORD-2025-001234",
  "userId": ObjectId,
  "items": [
    {
      "productId": ObjectId,
      "name": "Himalayan Salt",
      "price": 12.99,
      "quantity": 2,
      "image": "url"
    }
  ],
  "subtotal": 25.98,
  "shipping": 5.00,
  "tax": 2.60,
  "discount": 0,
  "total": 33.58,
  "shippingAddress": {...},
  "paymentMethod": "stripe",
  "paymentStatus": "paid", // pending, paid, failed, refunded
  "orderStatus": "processing", // pending, processing, shipped, delivered, cancelled
  "trackingNumber": "TRK123456789",
  "stripePaymentId": "pi_xxxxx",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Reviews Collection
```json
{
  "_id": ObjectId,
  "productId": ObjectId,
  "userId": ObjectId,
  "userName": "John D.",
  "rating": 5,
  "title": "Amazing quality!",
  "comment": "Best foxnuts I've ever had...",
  "images": ["url1", "url2"],
  "isVerifiedPurchase": true,
  "helpfulCount": 12,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Newsletter Collection
```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "status": "active", // active, unsubscribed
  "subscribedAt": ISODate,
  "unsubscribedAt": ISODate
}
```

### Subscriptions Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "email": "user@example.com",
  "plan": "monthly", // monthly, quarterly
  "productIds": [ObjectId],
  "status": "active", // active, paused, cancelled
  "nextDeliveryDate": ISODate,
  "stripeSubscriptionId": "sub_xxxxx",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

## Testing
```bash
# Run tests
pytest

# With coverage
pytest --cov=app tests/
```

## Deployment
See `DEPLOYMENT.md` for production deployment instructions.

## License
MIT
