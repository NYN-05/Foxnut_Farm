import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

const SearchBar = ({ products = [], onProductSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform instant search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = products.filter(product => {
      // Search in name
      const nameMatch = product.name?.toLowerCase().includes(query);
      
      // Search in description
      const descMatch = product.description?.toLowerCase().includes(query);
      
      // Search in tags
      const tagsMatch = product.tags?.some(tag => 
        tag.toLowerCase().includes(query)
      );

      // Search in ingredients
      const ingredientsMatch = product.ingredients?.toLowerCase().includes(query);

      return nameMatch || descMatch || tagsMatch || ingredientsMatch;
    });

    setSearchResults(results.slice(0, 6)); // Limit to 6 results
  }, [searchQuery, products]);

  // Highlight matching text
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-gray-900">{part}</mark>
      ) : (
        part
      )
    );
  };

  const handleProductClick = (product) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    setSearchResults([]);
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={20}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchOpen(true)}
          placeholder="Search foxnuts..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#74B72E] focus:border-transparent transition-all"
          aria-label="Search products"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isSearchOpen && searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50"
          >
            {searchResults.length > 0 ? (
              <div className="py-2">
                {/* Results Header */}
                <div className="px-4 py-2 text-sm text-gray-500 border-b">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </div>

                {/* Results List */}
                {searchResults.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    onClick={() => handleProductClick(product)}
                    className="px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Product Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {highlightText(product.name, searchQuery)}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {highlightText(product.description, searchQuery)}
                        </p>
                        
                        {/* Tags */}
                        {product.tags && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {product.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full"
                              >
                                {highlightText(tag, searchQuery)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ color: '#E76F51' }}>
                          ${product.price}
                        </div>
                        {product.compareAtPrice && (
                          <div className="text-sm text-gray-400 line-through">
                            ${product.compareAtPrice}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* View All Link */}
                <div className="px-4 py-3 text-center border-t">
                  <button 
                    className="text-[#74B72E] hover:text-[#5a9123] font-medium text-sm"
                    onClick={() => {
                      setIsSearchOpen(false);
                      // Navigate to products page with search query
                    }}
                  >
                    View all results →
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <Search className="mx-auto mb-3 text-gray-300" size={48} />
                <p className="text-gray-500 mb-1">No products found</p>
                <p className="text-sm text-gray-400">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
