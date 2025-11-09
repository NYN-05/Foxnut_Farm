// Centralized products data for the entire application
export const products = [
  {
    id: 1,
    name: 'Himalayan Salt Foxnuts',
    description: 'Lightly roasted foxnuts seasoned with pink Himalayan salt for a perfect savory crunch',
    image: '/products/salt-foxnuts.jpg',
    alt: 'Himalayan Salt Foxnuts in a wooden bowl',
    price: 12.99,
    compareAtPrice: 15.99,
    tags: ['Organic', 'Gluten-Free', 'Vegan', 'Low-Calorie'],
    rating: 4.8,
    reviews: 127,
    images: [
      { url: '/products/salt-foxnuts.jpg', alt: 'Himalayan Salt Foxnuts - Front view' },
      { url: '/products/salt-foxnuts.jpg', alt: 'Himalayan Salt Foxnuts - Side view' },
      { url: '/products/salt-foxnuts.jpg', alt: 'Himalayan Salt Foxnuts - Close-up' }
    ],
    nutrition: {
      serving: '30g',
      calories: 110,
      protein: '4g',
      carbs: '18g',
      fat: '3g'
    },
    ingredients: 'Organic Foxnuts, Pink Himalayan Salt, Olive Oil',
    category: 'Savory',
    stock: 45,
    featured: true
  },
  {
    id: 2,
    name: 'Chili Garlic Foxnuts',
    description: 'Spicy and aromatic blend of red chili and roasted garlic on crispy foxnuts',
    image: '/products/chili-garlic.jpg',
    alt: 'Chili Garlic Foxnuts with spices',
    price: 13.99,
    compareAtPrice: 16.99,
    tags: ['Organic', 'Gluten-Free', 'Vegetarian', 'Spicy'],
    rating: 4.9,
    reviews: 98,
    images: [
      { url: '/products/chili-garlic.jpg', alt: 'Chili Garlic Foxnuts - Front view' },
      { url: '/products/chili-garlic.jpg', alt: 'Chili Garlic Foxnuts - Side view' },
      { url: '/products/chili-garlic.jpg', alt: 'Chili Garlic Foxnuts - Close-up' }
    ],
    nutrition: {
      serving: '30g',
      calories: 115,
      protein: '4g',
      carbs: '19g',
      fat: '3.5g'
    },
    ingredients: 'Organic Foxnuts, Red Chili Powder, Garlic Powder, Olive Oil, Sea Salt',
    category: 'Savory',
    stock: 32,
    featured: true
  },
  {
    id: 3,
    name: 'Caramel Crunch Foxnuts',
    description: 'Sweet and indulgent foxnuts coated with rich organic caramel',
    image: '/products/caramel-crunch.jpg',
    alt: 'Caramel Crunch Foxnuts close-up',
    price: 14.99,
    compareAtPrice: 17.99,
    tags: ['Organic', 'Gluten-Free', 'Vegetarian', 'Sweet'],
    rating: 5.0,
    reviews: 152,
    images: [
      { url: '/products/caramel-crunch.jpg', alt: 'Caramel Crunch Foxnuts - Front view' },
      { url: '/products/caramel-crunch.jpg', alt: 'Caramel Crunch Foxnuts - Side view' },
      { url: '/products/caramel-crunch.jpg', alt: 'Caramel Crunch Foxnuts - Close-up' }
    ],
    nutrition: {
      serving: '30g',
      calories: 160,
      protein: '3g',
      carbs: '22g',
      fat: '7g'
    },
    ingredients: 'Organic Foxnuts, Organic Cane Sugar, Butter, Vanilla Extract, Sea Salt',
    category: 'Sweet',
    stock: 8,
    featured: true
  },
  {
    id: 4,
    name: 'Peri Peri Foxnuts',
    description: 'Fiery African-inspired peri peri spice blend on crunchy foxnuts',
    image: '/products/peri-peri.jpg',
    alt: 'Peri Peri Foxnuts',
    price: 13.49,
    compareAtPrice: 15.99,
    tags: ['Organic', 'Gluten-Free', 'Vegan', 'Extra Spicy'],
    rating: 4.7,
    reviews: 84,
    images: [
      { url: '/products/peri-peri.jpg', alt: 'Peri Peri Foxnuts - Front view' },
      { url: '/products/peri-peri.jpg', alt: 'Peri Peri Foxnuts - Side view' },
      { url: '/products/peri-peri.jpg', alt: 'Peri Peri Foxnuts - Close-up' }
    ],
    nutrition: {
      serving: '30g',
      calories: 112,
      protein: '4g',
      carbs: '18g',
      fat: '3.2g'
    },
    ingredients: 'Organic Foxnuts, Peri Peri Spice Mix, Lemon Juice, Olive Oil',
    category: 'Savory',
    stock: 28,
    featured: false
  },
  {
    id: 5,
    name: 'Chocolate Delight Foxnuts',
    description: 'Premium dark chocolate coating over roasted foxnuts - guilt-free indulgence',
    image: '/products/chocolate.jpg',
    alt: 'Chocolate Delight Foxnuts',
    price: 15.99,
    compareAtPrice: 18.99,
    tags: ['Organic', 'Gluten-Free', 'Vegetarian', 'Dark Chocolate'],
    rating: 4.9,
    reviews: 134,
    images: [
      { url: '/products/chocolate.jpg', alt: 'Chocolate Delight Foxnuts - Front view' },
      { url: '/products/chocolate.jpg', alt: 'Chocolate Delight Foxnuts - Side view' },
      { url: '/products/chocolate.jpg', alt: 'Chocolate Delight Foxnuts - Close-up' }
    ],
    nutrition: {
      serving: '30g',
      calories: 165,
      protein: '3.5g',
      carbs: '20g',
      fat: '8g'
    },
    ingredients: 'Organic Foxnuts, Organic Dark Chocolate (70% Cocoa), Coconut Oil',
    category: 'Sweet',
    stock: 19,
    featured: false
  },
  {
    id: 6,
    name: 'Tandoori Masala Foxnuts',
    description: 'Authentic Indian tandoori spices blended perfectly with roasted foxnuts',
    image: '/products/tandoori.jpg',
    alt: 'Tandoori Masala Foxnuts',
    price: 12.99,
    compareAtPrice: 15.49,
    tags: ['Organic', 'Gluten-Free', 'Vegan', 'Indian Spice'],
    rating: 4.8,
    reviews: 76,
    images: [
      { url: '/products/tandoori.jpg', alt: 'Tandoori Masala Foxnuts - Front view' },
      { url: '/products/tandoori.jpg', alt: 'Tandoori Masala Foxnuts - Side view' },
      { url: '/products/tandoori.jpg', alt: 'Tandoori Masala Foxnuts - Close-up' }
    ],
    nutrition: {
      serving: '30g',
      calories: 108,
      protein: '4g',
      carbs: '17g',
      fat: '3g'
    },
    ingredients: 'Organic Foxnuts, Tandoori Spice Mix (Paprika, Cumin, Coriander), Yogurt Powder, Olive Oil',
    category: 'Savory',
    stock: 41,
    featured: false
  }
];

// Helper functions
export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getProductById = (id) => products.find(p => p.id === id);
export const getProductsByCategory = (category) => products.filter(p => p.category === category);
export const getLowStockProducts = () => products.filter(p => p.stock < 10);
