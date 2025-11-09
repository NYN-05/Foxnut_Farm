import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('foxnuts-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false); // Toggle for backend sync

  // Check if user is logged in and enable sync
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setSyncEnabled(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foxnuts-cart', JSON.stringify(cartItems));
    
    // Optionally sync with backend if user is logged in
    if (syncEnabled && localStorage.getItem('auth_token')) {
      syncCartWithBackend();
    }
  }, [cartItems, syncEnabled]);

  // Sync cart with backend
  const syncCartWithBackend = async () => {
    try {
      // This would sync the local cart with the backend
      // For now, we'll keep it local-first
      // await api.updateCart(cartItems);
    } catch (error) {
      // Silently fail - cart is already saved locally
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        toast.success(`Updated ${product.name} quantity in cart`, {
          icon: '🛒',
        });
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        toast.success(`${product.name} added to cart!`, {
          icon: '✅',
        });
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    const removedItem = cartItems.find(item => item.id === productId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    if (removedItem) {
      toast.success(`${removedItem.name} removed from cart`, {
        icon: '🗑️',
      });
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared', {
      icon: '🧹',
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
