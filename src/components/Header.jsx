import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Heart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SearchBar from './SearchBar';
import WishlistPage from './WishlistPage';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';

const Header = ({ onNavigate, products = [] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { getCartCount, setIsCartOpen } = useCart();
  const { getWishlistCount } = useWishlist();
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Check if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    toast.success(`Welcome, ${userData.name}!`, { icon: '👋' });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully', { icon: '👋' });
  };

  const navLinks = [
    { name: 'Home', href: '#hero', section: 'hero' },
    { name: 'Products', href: '#products', section: 'products' },
    { name: 'Our Farm', href: '#farm', section: 'farm' },
    { name: 'Quiz', href: '#quiz', section: 'quiz' },
    { name: 'Sustainability', href: '#sustainability', section: 'sustainability' }
  ];

  const handleNavClick = (e, section) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    const element = document.getElementById(section);
    if (element) {
      const offset = 80; // Header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    if (onNavigate) {
      onNavigate(section);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const onTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    
    if (isUpSwipe && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg' 
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between gap-4 h-20" role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="flex items-center gap-3 group flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Foxnuts Farm - Home"
          >
            <img 
              src="/icons/lotus_logo.jpg" 
              alt="Foxnuts Farm Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:rotate-12"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl" style={{ color: '#74B72E' }}>
                Foxnuts Farm
              </span>
              <span className="text-xs text-gray-600 hidden sm:block">Pure & Organic</span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <motion.a
                key={link.section}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.section)}
                className="text-gray-700 hover:text-[#74B72E] font-medium transition-colors relative group whitespace-nowrap"
                whileHover={{ y: -2 }}
                aria-label={`Navigate to ${link.name}`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#74B72E] transition-all group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar 
              products={products} 
              onProductSelect={handleProductSelect}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={`Wishlist with ${getWishlistCount()} items`}
            >
              <Heart 
                size={24}
                className={`${getWishlistCount() > 0 ? 'text-red-500 fill-red-500' : 'text-gray-700'}`}
              />
              {getWishlistCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {getWishlistCount()}
                </motion.span>
              )}
            </motion.button>

            {/* Shopping Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={`Shopping cart with ${getCartCount()} items`}
            >
              <img 
                src="/icons/box.jpg" 
                alt="" 
                className="w-6 h-6"
                aria-hidden="true"
              />
              {getCartCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-[#E76F51] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {getCartCount()}
                </motion.span>
              )}
            </motion.button>

            {/* Auth / User Profile */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{user.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Login
              </motion.button>
            )}

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 lg:px-6 py-2 rounded-full font-semibold text-white shadow-lg transition-shadow hover:shadow-xl whitespace-nowrap"
              style={{ backgroundColor: '#74B72E' }}
              aria-label="Shop now"
            >
              Shop Now
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-gray-700 transition-all"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-gray-700 transition-all"
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-gray-700 transition-all"
              />
            </div>
          </motion.button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="container-custom py-4">
              {/* Mobile Search Bar */}
              <div className="mb-4 px-4">
                <SearchBar 
                  products={products} 
                  onProductSelect={(product) => {
                    handleProductSelect(product);
                    setIsMobileMenuOpen(false);
                  }}
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-1 mb-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.section}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.section)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 hover:text-[#74B72E] font-medium transition-colors"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="flex-1 px-4 py-2.5 border-2 border-[#74B72E] text-[#74B72E] rounded-full font-semibold hover:bg-[#74B72E] hover:text-white transition-colors"
                  aria-label={`View cart with ${getCartCount()} items`}
                >
                  Cart ({getCartCount()})
                </button>
                <button
                  className="flex-1 px-4 py-2.5 bg-[#74B72E] text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                  aria-label="Shop now"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wishlist Panel */}
      {isWishlistOpen && (
        <WishlistPage onClose={() => setIsWishlistOpen(false)} />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </motion.header>
  );
};

export default Header;
