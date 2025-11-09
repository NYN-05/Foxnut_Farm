// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Service class
class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for fetch requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || data || 'API request failed');
      }

      return data;
    } catch (error) {
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.error('API Error:', error);
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ========== AUTH ENDPOINTS ==========
  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  }

  async logout() {
    localStorage.removeItem('auth_token');
    return { success: true };
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  // ========== PRODUCT ENDPOINTS ==========
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.get(`/products${queryParams ? '?' + queryParams : ''}`);
  }

  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  async searchProducts(query) {
    return this.get(`/products/search?q=${encodeURIComponent(query)}`);
  }

  // ========== CART ENDPOINTS ==========
  async getCart() {
    return this.get('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.post('/cart/add', { product_id: productId, quantity });
  }

  async updateCartItem(productId, quantity) {
    return this.put('/cart/update', { product_id: productId, quantity });
  }

  async removeFromCart(productId) {
    return this.delete(`/cart/${productId}`);
  }

  async clearCart() {
    return this.delete('/cart');
  }

  // ========== ORDER ENDPOINTS ==========
  async createOrder(orderData) {
    return this.post('/orders', orderData);
  }

  async getOrders() {
    return this.get('/orders');
  }

  async getOrder(id) {
    return this.get(`/orders/${id}`);
  }

  async updateOrderStatus(id, status) {
    return this.put(`/orders/${id}/status`, { status });
  }

  // ========== REVIEW ENDPOINTS ==========
  async getReviews(productId) {
    return this.get(`/reviews/product/${productId}`);
  }

  async createReview(reviewData) {
    return this.post('/reviews', reviewData);
  }

  async updateReview(id, reviewData) {
    return this.put(`/reviews/${id}`, reviewData);
  }

  async deleteReview(id) {
    return this.delete(`/reviews/${id}`);
  }

  async voteReview(id, helpful) {
    return this.post(`/reviews/${id}/vote`, { helpful });
  }

  // ========== WISHLIST ENDPOINTS ==========
  async getWishlist() {
    return this.get('/wishlist');
  }

  async addToWishlist(productId) {
    return this.post('/wishlist/add', { product_id: productId });
  }

  async removeFromWishlist(productId) {
    return this.delete(`/wishlist/${productId}`);
  }

  // ========== NEWSLETTER ENDPOINTS ==========
  async subscribeNewsletter(email) {
    return this.post('/newsletter/subscribe', { email });
  }

  async unsubscribeNewsletter(email) {
    return this.post('/newsletter/unsubscribe', { email });
  }

  // ========== SUBSCRIPTION ENDPOINTS ==========
  async getSubscriptionPlans() {
    return this.get('/subscriptions/plans');
  }

  async createSubscription(subscriptionData) {
    return this.post('/subscriptions', subscriptionData);
  }

  async getSubscriptions() {
    return this.get('/subscriptions');
  }

  async cancelSubscription(id) {
    return this.delete(`/subscriptions/${id}`);
  }

  // ========== ADMIN ENDPOINTS ==========
  async getStats() {
    return this.get('/admin/stats');
  }

  async getAllOrders() {
    return this.get('/admin/orders');
  }

  async updateProduct(id, productData) {
    return this.put(`/admin/products/${id}`, productData);
  }

  async deleteProduct(id) {
    return this.delete(`/admin/products/${id}`);
  }
}

// Create and export a singleton instance
const api = new APIService();
export default api;
