# Foxnuts Farm Backend - Setup Guide

## 🚀 Quick Start

### 1. Install Python Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` with your actual values:

```env
# MongoDB (Get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=foxnuts_farm

# JWT Secret (Generate a random string)
JWT_SECRET_KEY=your-super-secret-jwt-key-here
SECRET_KEY=your-flask-secret-key-here

# Stripe (Get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid (Get from SendGrid Dashboard)
SENDGRID_API_KEY=SG....
FROM_EMAIL=noreply@foxnutsfarm.com

# Cloudinary (Get from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server Config
PORT=5000
HOST=0.0.0.0
FLASK_DEBUG=True
```

### 3. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string and add to `.env`

### 4. Run the Server

```powershell
python app.py
```

The server will start on `http://localhost:5000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### **Authentication** (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (requires auth)
- `PUT /me` - Update profile (requires auth)
- `POST /change-password` - Change password (requires auth)
- `POST /addresses` - Add address (requires auth)
- `PUT /addresses/:id` - Update address (requires auth)
- `DELETE /addresses/:id` - Delete address (requires auth)

#### **Products** (`/api/products`)
- `GET /` - Get all products (with filters, pagination)
- `GET /:id` - Get product by ID
- `GET /slug/:slug` - Get product by slug
- `POST /` - Create product (admin only)
- `PUT /:id` - Update product (admin only)
- `DELETE /:id` - Delete product (admin only)
- `GET /categories` - Get all categories
- `GET /tags` - Get all tags

#### **Cart** (`/api/cart`)
- `GET /` - Get user's cart (requires auth)
- `POST /add` - Add item to cart (requires auth)
- `PUT /update` - Update cart item (requires auth)
- `DELETE /remove/:productId` - Remove item (requires auth)
- `DELETE /clear` - Clear cart (requires auth)

#### **Orders** (`/api/orders`)
- `POST /` - Create order (requires auth)
- `GET /` - Get user's orders (requires auth)
- `GET /:id` - Get order details (requires auth)
- `GET /track/:orderNumber` - Track order (public)
- `POST /:id/cancel` - Cancel order (requires auth)
- `GET /admin` - Get all orders (admin only)
- `PUT /:id/status` - Update order status (admin only)
- `PUT /:id/tracking` - Add tracking info (admin only)

#### **Reviews** (`/api/reviews`)
- `GET /product/:id` - Get product reviews
- `GET /user` - Get user's reviews (requires auth)
- `POST /` - Create review (requires auth)
- `PUT /:id` - Update review (requires auth)
- `DELETE /:id` - Delete review (requires auth)
- `POST /:id/helpful` - Mark helpful (public)

#### **Newsletter** (`/api/newsletter`)
- `POST /subscribe` - Subscribe to newsletter
- `POST /unsubscribe` - Unsubscribe from newsletter
- `GET /subscribers` - Get all subscribers (admin)

#### **Subscriptions** (`/api/subscriptions`)
- `GET /` - Get user's subscriptions (requires auth)
- `POST /` - Create subscription (requires auth)
- `PUT /:id` - Update subscription (requires auth)
- `POST /:id/pause` - Pause subscription (requires auth)
- `POST /:id/resume` - Resume subscription (requires auth)
- `DELETE /:id` - Cancel subscription (requires auth)

#### **Wishlist** (`/api/wishlist`)
- `GET /` - Get wishlist (requires auth)
- `POST /add/:productId` - Add to wishlist (requires auth)
- `DELETE /remove/:productId` - Remove from wishlist (requires auth)
- `GET /check/:productId` - Check if in wishlist (requires auth)

#### **Admin** (`/api/admin`)
- `GET /dashboard` - Get dashboard stats (admin only)
- `GET /users` - Get all users (admin only)
- `PUT /users/:id/role` - Update user role (admin only)
- `GET /analytics/sales` - Get sales analytics (admin only)
- `GET /analytics/customers` - Get customer analytics (admin only)

---

## 🧪 Testing the API

### Using cURL (PowerShell)

**Register a user:**
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"Test1234\",\"name\":\"Test User\"}'
```

**Login:**
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"Test1234\"}'
```

**Get products:**
```powershell
curl http://localhost:5000/api/products/
```

### Using Postman

1. Import the API endpoints
2. Create an environment with `BASE_URL = http://localhost:5000/api`
3. After login, save the token as `{{TOKEN}}`
4. Use `Bearer {{TOKEN}}` in Authorization header

---

## 🗄️ Database Collections

### Users
- Email, password (hashed), name, phone
- Role (customer/admin)
- Addresses array
- Wishlist array

### Products
- Name, slug, description, price
- Images, category, tags
- Stock, SKU
- Nutrition facts, ingredients
- Average rating, total reviews

### Orders
- User ID, order number
- Items array (product, quantity, price)
- Shipping/billing addresses
- Payment method, payment status
- Order status, tracking info
- Status history

### Reviews
- User ID, product ID
- Rating (1-5), title, comment
- Verified purchase flag
- Helpful count

### Newsletter
- Email, name
- Subscribed/unsubscribed dates
- Active status

### Subscriptions
- User ID, product ID
- Quantity, frequency (weekly/monthly)
- Next delivery date
- Status (active/paused/cancelled)

### Carts
- User ID
- Items array
- Total

---

## 🔧 Development Tips

### Seed Sample Data

The database will auto-create indexes on first run. To seed initial products, uncomment the seed function in `database/db.py`.

### Create Admin User

After registering, manually update the user role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@foxnutsfarm.com" },
  { $set: { role: "admin" } }
)
```

### Enable Debug Logging

Set `FLASK_DEBUG=True` in `.env` for detailed error messages and auto-reload.

### CORS Configuration

Update `FRONTEND_URL` in `.env` if your frontend runs on a different port.

---

## 📦 Project Structure

```
backend/
├── app.py                  # Main Flask application
├── config.py               # Configuration settings
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── database/
│   └── db.py              # Database connection & indexes
├── models/
│   ├── user.py            # User model
│   ├── product.py         # Product model
│   ├── order.py           # Order model
│   └── review.py          # Review model
├── routes/
│   ├── auth_routes.py     # Authentication endpoints
│   ├── product_routes.py  # Product endpoints
│   ├── cart_routes.py     # Cart endpoints
│   ├── order_routes.py    # Order endpoints
│   ├── review_routes.py   # Review endpoints
│   ├── newsletter_routes.py # Newsletter endpoints
│   ├── subscription_routes.py # Subscription endpoints
│   ├── wishlist_routes.py # Wishlist endpoints
│   └── admin_routes.py    # Admin endpoints
└── middleware/
    ├── auth_middleware.py # JWT authentication
    ├── error_handler.py   # Error handling
    └── validators.py      # Request validation
```

---

## 🚀 Deployment

### Railway / Render

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically from main branch

### Docker (optional)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

---

## 📝 Notes

- All passwords are hashed with bcrypt
- JWT tokens expire after 1 hour
- MongoDB indexes are auto-created on startup
- Email validation uses regex pattern
- Product stock updates automatically on order
- Review ratings update product averages

---

## 🆘 Troubleshooting

**Import errors:**
```powershell
pip install -r requirements.txt --upgrade
```

**MongoDB connection failed:**
- Check MONGODB_URI in .env
- Verify IP whitelist in Atlas
- Ensure database user has correct permissions

**CORS errors:**
- Update FRONTEND_URL in .env
- Check Flask-CORS configuration in app.py

**Port already in use:**
- Change PORT in .env
- Or kill process: `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process`

---

## ✅ Ready to Go!

Your Flask backend is now ready to serve the Foxnuts Farm e-commerce platform! 🎉

Start the server and test the endpoints with your React frontend.
