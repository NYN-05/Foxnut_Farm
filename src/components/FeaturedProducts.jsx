import { motion } from 'framer-motion';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductModal from './ProductModal';
import { getFeaturedProducts } from '../data/products';

const FeaturedProducts = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleWishlistClick = (e, product) => {
    e.stopPropagation(); // Prevent opening modal when clicking heart
    toggleWishlist(product);
  };

  // Get featured products from centralized data
  const products = getFeaturedProducts();

  return (
    <section className="section-padding" style={{ backgroundColor: '#FFFDF8' }}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">Featured Products</h2>
          <p className="text-body max-w-2xl mx-auto">
            Handpicked varieties crafted with care from our sustainable farm
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              onHoverStart={() => setHoveredCard(product.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="card group cursor-pointer focus-within:ring-2 focus-within:ring-[#74B72E]"
              role="article"
              aria-label={`${product.name} product card`}
            >
              {/* Product Image */}
              <div 
                className="h-64 relative overflow-hidden"
                style={{ backgroundColor: '#FFFFFF' }}
                onClick={() => openProductModal(product)}
              >
                <img 
                  src={product.image}
                  alt={product.alt}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    hoveredCard === product.id ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                
                {/* Wishlist Button */}
                <button
                  onClick={(e) => handleWishlistClick(e, product)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#74B72E]"
                  aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    size={20}
                    className={`transition-colors ${
                      isInWishlist(product.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6 bg-white">
                <h3 className="heading-3 mb-3">{product.name}</h3>
                <p className="text-body mb-4 min-h-[3rem]">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: '#E76F51' }} aria-label={`Price: ${product.price}`}>
                    {product.price}
                  </span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="btn-primary text-sm px-6 py-2 focus:outline-none focus:ring-2 focus:ring-[#74B72E] focus:ring-offset-2"
                    aria-label={`Add ${product.name} foxnuts to shopping cart for ${product.price}`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button 
            className="btn-primary"
            aria-label="Shop all products"
          >
            Shop All Products →
          </button>
        </motion.div>
      </div>

      {/* Product Quick View Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default FeaturedProducts;
