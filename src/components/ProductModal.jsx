import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const images = product.images || [
    { url: product.image, alt: product.name },
    { url: product.image, alt: `${product.name} - view 2` },
    { url: product.image, alt: `${product.name} - view 3` }
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9994]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9995] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
                  {/* Left: Image Gallery */}
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                      <img
                        src={images[selectedImage].url}
                        alt={images[selectedImage].alt}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Image Navigation */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === selectedImage
                                ? 'bg-white w-6'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              idx === selectedImage
                                ? 'border-sage-600 ring-2 ring-sage-200'
                                : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={img.alt}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Product Details */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h2 className="text-3xl font-bold text-gray-900">
                          {product.name}
                        </h2>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <Heart className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating || 4.8)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating || 4.8} ({product.reviews || 127} reviews)
                        </span>
                      </div>

                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-sage-600">
                        ${product.price}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          ${product.compareAtPrice}
                        </span>
                      )}
                      {product.compareAtPrice && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                          Save ${(product.compareAtPrice - product.price).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {product.tags && (
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-sage-50 text-sage-700 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Nutrition Facts */}
                    {product.nutrition && (
                      <div className="bg-cream-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Nutrition Facts (per {product.nutrition.serving || '30g'})
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Calories</span>
                            <span className="font-semibold">{product.nutrition.calories || 140}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Protein</span>
                            <span className="font-semibold">{product.nutrition.protein || '4g'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Carbs</span>
                            <span className="font-semibold">{product.nutrition.carbs || '18g'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fat</span>
                            <span className="font-semibold">{product.nutrition.fat || '6g'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ingredients */}
                    {product.ingredients && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
                        <p className="text-sm text-gray-600">
                          {product.ingredients}
                        </p>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">Quantity:</span>
                      <div className="flex items-center border-2 border-gray-200 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-6 py-2 font-semibold min-w-[60px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={showSuccess}
                      className="w-full bg-sage-600 hover:bg-sage-700 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {showSuccess ? (
                        <>
                          <Check className="w-5 h-5" />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </button>

                    {/* Additional Info */}
                    <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Free shipping on orders over $50</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>30-day money-back guarantee</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>100% organic & sustainably sourced</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Reviews Preview */}
                <div className="px-6 md:px-8 pb-8">
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Customer Reviews
                    </h3>
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <p className="text-gray-600">
                        Reviews coming soon! Be the first to review this product.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
