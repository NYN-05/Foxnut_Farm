import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Share2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistPage = ({ onClose }) => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Lock body scroll when wishlist is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const handleShare = () => {
    const wishlistNames = wishlistItems.map(item => item.name).join(', ');
    const shareText = `Check out my Foxnuts Farm wishlist: ${wishlistNames}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Foxnuts Wishlist',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Wishlist copied to clipboard!', { icon: '📋' });
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />
      
      {/* Wishlist Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white shadow-2xl z-[9999] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Heart size={24} className="text-red-500 fill-red-500" />
                <h2 className="text-2xl font-bold">My Wishlist</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close wishlist"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {wishlistItems.length === 0 ? (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Heart size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">
                  Save your favorite products to come back later!
                </p>
                <button
                  onClick={onClose}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </motion.div>
            ) : (
              <>
                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleShare}
                    className="flex-1 px-4 py-2 border-2 border-[#74B72E] text-[#74B72E] rounded-full font-semibold hover:bg-[#74B72E] hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                  {wishlistItems.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear your wishlist?')) {
                          clearWishlist();
                        }
                      }}
                      className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Clear
                    </button>
                  )}
                </div>

                {/* Wishlist Items */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {wishlistItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="card flex gap-4 hover:shadow-lg transition-shadow"
                      >
                        {/* Product Image */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold" style={{ color: '#E76F51' }}>
                              ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                            </span>
                            {item.compareAtPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ${item.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="flex-1 px-3 py-1.5 text-sm font-semibold text-white rounded-full transition-colors flex items-center justify-center gap-1"
                              style={{ backgroundColor: '#74B72E' }}
                            >
                              <ShoppingCart size={14} />
                              Add to Cart
                            </button>
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              aria-label="Remove from wishlist"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-[#74B72E]">
                  <p className="text-sm text-center mb-3">
                    💚 <strong>{wishlistItems.length} products</strong> waiting for you!
                  </p>
                  <button
                    onClick={() => {
                      wishlistItems.forEach(item => addToCart(item));
                      clearWishlist();
                      onClose();
                    }}
                    className="btn-primary w-full"
                  >
                    Add All to Cart
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
    </AnimatePresence>
  );
};

export default WishlistPage;
