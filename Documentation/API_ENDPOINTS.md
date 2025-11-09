# 🔌 Foxnuts Farm - Complete API Endpoints List

**Base URL:** `http://localhost:5000/api`  
**Authentication:** Bearer Token in Authorization header for protected routes

---

## 📋 Table of Contents

1. [Authentication & User Management](#1-authentication--user-management)
2. [Products](#2-products)
3. [Shopping Cart](#3-shopping-cart)
4. [Orders](#4-orders)
5. [Reviews](#5-reviews)
6. [Newsletter](#6-newsletter)
7. [Subscriptions](#7-subscriptions)
8. [Wishlist](#8-wishlist)
9. [Admin Dashboard](#9-admin-dashboard)

---

## 1. Authentication & User Management

### Base Path: `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ Public | Register new user account |
| POST | `/login` | ❌ Public | Login user and get JWT token |
| GET | `/me` | 🔒 Required | Get current logged-in user profile |
| PUT | `/me` | 🔒 Required | Update user profile (name, phone) |
| POST | `/change-password` | 🔒 Required | Change user password |
| POST | `/addresses` | 🔒 Required | Add new delivery address |
| PUT | `/addresses/:addressId` | 🔒 Required | Update existing address |
| DELETE | `/addresses/:addressId` | 🔒 Required | Delete delivery address |

#### Request/Response Examples:

**POST `/api/auth/register`**
```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "phone": "+1234567890"
}

// Response (201)
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**POST `/api/auth/login`**
```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

// Response (200)
{
  "message": "Login successful",
  "user": { /* user object */ },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Products

### Base Path: `/api/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ Public | Get all products with filters & pagination |
| GET | `/:productId` | ❌ Public | Get single product by ID |
| GET | `/slug/:slug` | ❌ Public | Get single product by slug |
| POST | `/` | 👑 Admin | Create new product |
| PUT | `/:productId` | 👑 Admin | Update product details |
| DELETE | `/:productId` | 👑 Admin | Delete product (soft delete) |
| PUT | `/:productId/stock` | 👑 Admin | Update product stock quantity |
| GET | `/categories` | ❌ Public | Get all product categories |
| GET | `/tags` | ❌ Public | Get all product tags |

#### Query Parameters for GET `/api/products/`:

```
?page=1                    # Page number (default: 1)
&limit=20                  # Items per page (default: 20)
&category=salty            # Filter by category
&minPrice=10               # Minimum price filter
&maxPrice=50               # Maximum price filter
&tags=organic,vegan        # Filter by tags (comma-separated)
&sortBy=price              # Sort field (price, createdAt, name)
&sortOrder=asc             # Sort order (asc, desc)
&search=himalayan          # Text search query
```

#### Request/Response Examples:

**GET `/api/products/?category=salty&limit=10`**
```json
// Response (200)
{
  "products": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Himalayan Salt Foxnuts",
      "slug": "himalayan-salt-foxnuts",
      "description": "Perfectly roasted with pure Himalayan pink salt",
      "price": 12.99,
      "compareAtPrice": 15.99,
      "images": [
        {
          "url": "/products/himalayan-salt.jpg",
          "alt": "Bowl of roasted foxnuts",
          "isPrimary": true
        }
      ],
      "category": "salty",
      "tags": ["organic", "gluten-free", "vegan"],
      "stock": 100,
      "sku": "FN-HIM-SALT-001",
      "averageRating": 4.8,
      "totalReviews": 127,
      "isActive": true
    }
  ],
  "total": 45,
  "page": 1,
  "pages": 5
}
```

**POST `/api/products/` (Admin)**
```json
// Request
{
  "name": "Caramel Crunch Foxnuts",
  "slug": "caramel-crunch-foxnuts",
  "description": "Sweet indulgence meets healthy snacking",
  "price": 14.99,
  "compareAtPrice": 17.99,
  "category": "sweet",
  "tags": ["organic", "gluten-free", "dessert"],
  "stock": 50,
  "sku": "FN-CAR-CRU-003",
  "images": [
    {
      "url": "/products/caramel.jpg",
      "alt": "Caramel coated foxnuts",
      "isPrimary": true
    }
  ],
  "nutritionFacts": {
    "servingSize": "30g",
    "calories": 160,
    "protein": "3g"
  },
  "ingredients": ["Organic Foxnuts", "Organic Cane Sugar"]
}

// Response (201)
{
  "message": "Product created successfully",
  "product": { /* product object */ }
}
```

---

## 3. Shopping Cart

### Base Path: `/api/cart`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | 🔒 Required | Get user's shopping cart |
| POST | `/add` | 🔒 Required | Add item to cart |
| PUT | `/update` | 🔒 Required | Update cart item quantity |
| DELETE | `/remove/:productId` | 🔒 Required | Remove item from cart |
| DELETE | `/clear` | 🔒 Required | Clear entire cart |

#### Request/Response Examples:

**POST `/api/cart/add`**
```json
// Request
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}

// Response (200)
{
  "message": "Item added to cart",
  "cart": {
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "name": "Himalayan Salt Foxnuts",
        "price": 12.99,
        "image": "/products/himalayan-salt.jpg",
        "quantity": 2
      }
    ],
    "total": 25.98,
    "itemCount": 1
  }
}
```

**PUT `/api/cart/update`**
```json
// Request
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 5
}

// Response (200)
{
  "message": "Cart updated",
  "cart": { /* updated cart */ }
}
```

---

## 4. Orders

### Base Path: `/api/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | 🔒 Required | Create new order |
| GET | `/` | 🔒 Required | Get user's order history |
| GET | `/:orderId` | 🔒 Required | Get single order details |
| GET | `/track/:orderNumber` | ❌ Public | Track order by order number |
| POST | `/:orderId/cancel` | 🔒 Required | Cancel order (if pending) |
| GET | `/admin` | 👑 Admin | Get all orders (admin) |
| PUT | `/:orderId/status` | 👑 Admin | Update order status (admin) |
| PUT | `/:orderId/tracking` | 👑 Admin | Add tracking info (admin) |

#### Request/Response Examples:

**POST `/api/orders/`**
```json
// Request
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "name": "Himalayan Salt Foxnuts",
      "price": 12.99,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "notes": "Please deliver after 5 PM"
}

// Response (201)
{
  "message": "Order created successfully",
  "order": {
    "id": "507f1f77bcf86cd799439012",
    "orderNumber": "FN-20251109-A1B2C3",
    "items": [ /* items array */ ],
    "subtotal": 25.98,
    "shippingCost": 5.99,
    "tax": 2.08,
    "total": 34.05,
    "orderStatus": "pending",
    "paymentStatus": "pending",
    "createdAt": "2025-11-09T10:30:00Z"
  }
}
```

**GET `/api/orders/track/FN-20251109-A1B2C3`** (Public)
```json
// Response (200)
{
  "orderNumber": "FN-20251109-A1B2C3",
  "orderStatus": "shipped",
  "trackingNumber": "1Z999AA10123456784",
  "trackingCarrier": "UPS",
  "statusHistory": [
    {
      "status": "pending",
      "timestamp": "2025-11-09T10:30:00Z",
      "note": "Order placed"
    },
    {
      "status": "processing",
      "timestamp": "2025-11-09T12:00:00Z",
      "note": "Order confirmed"
    },
    {
      "status": "shipped",
      "timestamp": "2025-11-09T15:00:00Z",
      "note": "Tracking number added"
    }
  ],
  "createdAt": "2025-11-09T10:30:00Z"
}
```

---

## 5. Reviews

### Base Path: `/api/reviews`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/product/:productId` | ❌ Public | Get reviews for a product |
| GET | `/user` | 🔒 Required | Get user's reviews |
| POST | `/` | 🔒 Required | Create new review |
| PUT | `/:reviewId` | 🔒 Required | Update user's review |
| DELETE | `/:reviewId` | 🔒 Required | Delete user's review |
| POST | `/:reviewId/helpful` | ❌ Public | Mark review as helpful |

#### Request/Response Examples:

**POST `/api/reviews/`**
```json
// Request
{
  "productId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "title": "Amazing taste!",
  "comment": "Best foxnuts I've ever had. Perfectly roasted and seasoned."
}

// Response (201)
{
  "message": "Review created successfully",
  "review": {
    "id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439010",
    "productId": "507f1f77bcf86cd799439011",
    "rating": 5,
    "title": "Amazing taste!",
    "comment": "Best foxnuts I've ever had...",
    "isVerified": false,
    "helpful": 0,
    "createdAt": "2025-11-09T10:30:00Z"
  }
}
```

**GET `/api/reviews/product/:productId?page=1&limit=10`**
```json
// Response (200)
{
  "reviews": [
    {
      "id": "507f1f77bcf86cd799439013",
      "userName": "John Doe",
      "rating": 5,
      "title": "Amazing taste!",
      "comment": "Best foxnuts I've ever had...",
      "isVerified": true,
      "helpful": 15,
      "createdAt": "2025-11-09T10:30:00Z"
    }
  ],
  "total": 127,
  "page": 1,
  "pages": 13
}
```

---

## 6. Newsletter

### Base Path: `/api/newsletter`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/subscribe` | ❌ Public | Subscribe to newsletter |
| POST | `/unsubscribe` | ❌ Public | Unsubscribe from newsletter |
| GET | `/subscribers` | 👑 Admin | Get all subscribers (admin) |

#### Request/Response Examples:

**POST `/api/newsletter/subscribe`**
```json
// Request
{
  "email": "user@example.com",
  "name": "John Doe"
}

// Response (201)
{
  "message": "Successfully subscribed to newsletter"
}
```

**POST `/api/newsletter/unsubscribe`**
```json
// Request
{
  "email": "user@example.com"
}

// Response (200)
{
  "message": "Successfully unsubscribed from newsletter"
}
```

---

## 7. Subscriptions

### Base Path: `/api/subscriptions`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | 🔒 Required | Get user's subscriptions |
| POST | `/` | 🔒 Required | Create new subscription |
| PUT | `/:subscriptionId` | 🔒 Required | Update subscription |
| POST | `/:subscriptionId/pause` | 🔒 Required | Pause subscription |
| POST | `/:subscriptionId/resume` | 🔒 Required | Resume subscription |
| DELETE | `/:subscriptionId` | 🔒 Required | Cancel subscription |

#### Request/Response Examples:

**POST `/api/subscriptions/`**
```json
// Request
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2,
  "frequency": "monthly"  // weekly, biweekly, monthly
}

// Response (201)
{
  "message": "Subscription created successfully",
  "subscription": {
    "id": "507f1f77bcf86cd799439014",
    "productId": "507f1f77bcf86cd799439011",
    "quantity": 2,
    "frequency": "monthly",
    "nextDelivery": "2025-12-09T10:30:00Z"
  }
}
```

**PUT `/api/subscriptions/:subscriptionId`**
```json
// Request
{
  "quantity": 3,
  "frequency": "biweekly"
}

// Response (200)
{
  "message": "Subscription updated successfully"
}
```

---

## 8. Wishlist

### Base Path: `/api/wishlist`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | 🔒 Required | Get user's wishlist |
| POST | `/add/:productId` | 🔒 Required | Add product to wishlist |
| DELETE | `/remove/:productId` | 🔒 Required | Remove product from wishlist |
| GET | `/check/:productId` | 🔒 Required | Check if product is in wishlist |

#### Request/Response Examples:

**POST `/api/wishlist/add/:productId`**
```json
// Response (200)
{
  "message": "Added to wishlist",
  "wishlist": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

**GET `/api/wishlist/`**
```json
// Response (200)
{
  "wishlist": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Himalayan Salt Foxnuts",
      "price": 12.99,
      "image": "/products/himalayan-salt.jpg"
      // ... full product object
    }
  ]
}
```

---

## 9. Admin Dashboard

### Base Path: `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | 👑 Admin | Get dashboard statistics |
| GET | `/users` | 👑 Admin | Get all users with pagination |
| PUT | `/users/:userId/role` | 👑 Admin | Update user role |
| GET | `/analytics/sales` | 👑 Admin | Get sales analytics |
| GET | `/analytics/customers` | 👑 Admin | Get customer analytics |

#### Request/Response Examples:

**GET `/api/admin/dashboard`**
```json
// Response (200)
{
  "totalUsers": 1247,
  "totalProducts": 45,
  "totalOrders": 3891,
  "totalRevenue": 48762.50,
  "ordersByStatus": {
    "pending": 23,
    "processing": 45,
    "shipped": 89,
    "delivered": 3701,
    "cancelled": 33
  },
  "recentOrders": 156,
  "topProducts": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Himalayan Salt Foxnuts",
      "totalSold": 1250,
      "revenue": 16237.50
    }
  ],
  "newsletterSubscribers": 892,
  "activeSubscriptions": 234
}
```

**GET `/api/admin/analytics/sales?days=30`**
```json
// Response (200)
{
  "dailySales": [
    {
      "_id": { "year": 2025, "month": 11, "day": 1 },
      "revenue": 1250.50,
      "orders": 35
    }
  ],
  "categoryPerformance": [
    {
      "_id": "salty",
      "revenue": 15000.00,
      "units": 1200
    },
    {
      "_id": "sweet",
      "revenue": 12000.00,
      "units": 950
    }
  ]
}
```

---

## 🔐 Authentication

### Header Format:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration:
- **Access Token:** 1 hour
- **Refresh Token:** 30 days (if implemented)

---

## 📊 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (e.g., email already exists) |
| 422 | Unprocessable Entity (validation error) |
| 500 | Internal Server Error |

---

## 🚨 Error Response Format

All errors return consistent format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

**Examples:**

```json
// 401 Unauthorized
{
  "error": "Unauthorized",
  "message": "Authentication token required"
}

// 400 Bad Request
{
  "error": "Missing required fields",
  "fields": ["email", "password"]
}

// 404 Not Found
{
  "error": "Not Found",
  "message": "Product not found"
}
```

---

## 📝 API Summary

**Total Endpoints:** 60+

| Category | Endpoints | Public | Auth | Admin |
|----------|-----------|--------|------|-------|
| Authentication | 8 | 2 | 6 | 0 |
| Products | 9 | 6 | 0 | 3 |
| Cart | 5 | 0 | 5 | 0 |
| Orders | 8 | 1 | 4 | 3 |
| Reviews | 6 | 2 | 4 | 0 |
| Newsletter | 3 | 2 | 0 | 1 |
| Subscriptions | 6 | 0 | 6 | 0 |
| Wishlist | 4 | 0 | 4 | 0 |
| Admin | 5 | 0 | 0 | 5 |
| **TOTAL** | **54** | **13** | **29** | **12** |

---

## 🧪 Testing APIs

### Using cURL (PowerShell):

**Register:**
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

**Get Products:**
```powershell
curl http://localhost:5000/api/products/
```

**Add to Cart (with auth):**
```powershell
curl -X POST http://localhost:5000/api/cart/add `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN_HERE" `
  -d '{\"productId\":\"507f1f77bcf86cd799439011\",\"quantity\":2}'
```

### Using JavaScript (Frontend):

```javascript
// Set base URL
const API_BASE = 'http://localhost:5000/api';

// Login
const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Get products
const getProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE}/products?${params}`);
  return response.json();
};

// Add to cart (authenticated)
const addToCart = async (productId, quantity) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });
  return response.json();
};

// Create order (authenticated)
const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return response.json();
};
```

---

## 🎯 Implementation Priority

### Phase 1 - Core (Essential)
1. ✅ Authentication (register, login)
2. ✅ Products (list, view)
3. ✅ Cart (add, update, remove)
4. ✅ Orders (create, view)

### Phase 2 - Engagement
5. ✅ Reviews (create, view)
6. ✅ Newsletter (subscribe)
7. ✅ Wishlist (add, remove)

### Phase 3 - Advanced
8. ✅ Subscriptions (recurring orders)
9. ✅ Order tracking (public)
10. ✅ Admin dashboard

### Phase 4 - Enhancements
11. Payment processing (Stripe)
12. Email notifications (SendGrid)
13. Image uploads (Cloudinary)
14. Advanced analytics

---

## 📚 Additional Resources

- **Full Backend Documentation:** `backend/README.md`
- **Setup Guide:** `backend/SETUP.md`
- **Quick Start:** `QUICKSTART.md`

---

**Last Updated:** November 9, 2025  
**API Version:** 1.0.0  
**Total Endpoints:** 54
