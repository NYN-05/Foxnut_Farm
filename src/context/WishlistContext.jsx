import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    // Load wishlist from localStorage on initial render
    const savedWishlist = localStorage.getItem('foxnuts-wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [syncEnabled, setSyncEnabled] = useState(false); // Enable when user is logged in

  // Check if user is logged in and enable sync
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setSyncEnabled(true);
    }
  }, []);

  // Load wishlist from backend if logged in
  useEffect(() => {
    const loadWishlist = async () => {
      const token = localStorage.getItem('auth_token');
      if (token && syncEnabled) {
        try {
          const data = await api.getWishlist();
          if (data && data.items) {
            setWishlistItems(data.items);
            localStorage.setItem('foxnuts-wishlist', JSON.stringify(data.items));
          }
        } catch (error) {
          // Silently fall back to local storage
        }
      }
    };

    loadWishlist();
  }, [syncEnabled]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foxnuts-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = async (product) => {
    const exists = wishlistItems.find(item => item.id === product.id);
    
    if (exists) {
      toast.error(`${product.name} is already in your wishlist`, {
        icon: 'ℹ️',
      });
      return false;
    }

    try {
      // Try to save to backend if logged in
      const token = localStorage.getItem('auth_token');
      if (token && syncEnabled) {
        await api.addToWishlist(product.id);
      }
    } catch (error) {
      // Silently fall back to local storage
    }

    setWishlistItems([...wishlistItems, product]);
    toast.success(`${product.name} added to wishlist!`, {
      icon: '❤️',
    });
    return true;
  };

  const removeFromWishlist = async (productId) => {
    const item = wishlistItems.find(item => item.id === productId);
    
    try {
      // Try to remove from backend if logged in
      const token = localStorage.getItem('auth_token');
      if (token && syncEnabled) {
        await api.removeFromWishlist(productId);
      }
    } catch (error) {
      // Silently fall back to local storage
    }

    setWishlistItems(wishlistItems.filter(item => item.id !== productId));
    
    if (item) {
      toast.success(`${item.name} removed from wishlist`, {
        icon: '💔',
      });
    }
  };

  const toggleWishlist = (product) => {
    const exists = wishlistItems.find(item => item.id === product.id);
    
    if (exists) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast.success('Wishlist cleared', {
      icon: '🧹',
    });
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
