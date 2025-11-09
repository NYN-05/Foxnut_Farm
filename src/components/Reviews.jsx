import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Reviews = ({ productId, averageRating = 0, totalReviews = 0 }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      date: '2024-10-28',
      verified: true,
      comment: 'Best foxnuts I\'ve ever had! The Himalayan salt flavor is perfectly balanced. Crispy and fresh!',
      helpful: 12,
      images: []
    },
    {
      id: 2,
      author: 'Mike R.',
      rating: 4,
      date: '2024-10-25',
      verified: true,
      comment: 'Really good snack. Healthy alternative to chips. Would love to see more flavors!',
      helpful: 8,
      images: []
    },
    {
      id: 3,
      author: 'Priya K.',
      rating: 5,
      date: '2024-10-20',
      verified: true,
      comment: 'Authentic Indian makhana! Reminds me of home. Great quality and sustainable packaging.',
      helpful: 15,
      images: []
    },
  ]);

  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    comment: ''
  });

  const [sortBy, setSortBy] = useState('helpful'); // 'helpful', 'recent', 'highest', 'lowest'
  const [filterRating, setFilterRating] = useState(0); // 0 = all, 5,4,3,2,1
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [helpfulClicks, setHelpfulClicks] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Optionally load reviews from backend
  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await api.getReviews(productId);
      if (data && data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      // Fallback to local reviews if backend is not available
    } finally {
      setIsLoading(false);
    }
  };

  // Submit new review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.author.trim() || !newReview.comment.trim()) {
      toast.error('Please fill in all fields', { icon: '⚠️' });
      return;
    }

    setIsSubmitting(true);

    const review = {
      id: Date.now(),
      ...newReview,
      product_id: productId,
      date: new Date().toISOString().split('T')[0],
      verified: false,
      helpful: 0,
      images: []
    };

    try {
      // Try to save to backend
      const savedReview = await api.createReview(review);
      setReviews([savedReview, ...reviews]);
    } catch (error) {
      // Fallback: Save locally
      setReviews([review, ...reviews]);
    } finally {
      setIsSubmitting(false);
    }

    setNewReview({ author: '', rating: 5, comment: '' });
    setShowReviewForm(false);
    
    toast.success('Review submitted! Thank you for your feedback!', {
      icon: '⭐',
      duration: 4000
    });
  };

  // Mark review as helpful
  const handleHelpful = async (reviewId) => {
    if (helpfulClicks[reviewId]) {
      toast.error('You already marked this review as helpful', { icon: 'ℹ️' });
      return;
    }

    try {
      // Try backend vote
      await api.voteReview(reviewId, 'helpful');
    } catch (error) {
      // Fallback to local update
    }

    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));

    setHelpfulClicks({ ...helpfulClicks, [reviewId]: true });
    toast.success('Thanks for your feedback!', { icon: '👍' });
  };

  // Sort reviews
  const getSortedReviews = () => {
    let filtered = filterRating > 0 
      ? reviews.filter(r => r.rating === filterRating)
      : reviews;

    switch (sortBy) {
      case 'helpful':
        return [...filtered].sort((a, b) => b.helpful - a.helpful);
      case 'recent':
        return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'highest':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...filtered].sort((a, b) => a.rating - b.rating);
      default:
        return filtered;
    }
  };

  // Render star rating
  const StarRating = ({ rating, size = 20, interactive = false, onChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  // Rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const sortedReviews = getSortedReviews();

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="text-5xl font-bold" style={{ color: '#E76F51' }}>
              {averageRating || (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0).toFixed(1)}
            </div>
            <div>
              <StarRating rating={Math.round(averageRating || reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)} size={24} />
              <p className="text-gray-600 mt-1">
                Based on {totalReviews || reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Rating Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card"
          >
            <h3 className="font-semibold text-lg mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(star => {
                const count = ratingDistribution[star];
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                
                return (
                  <button
                    key={star}
                    onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                    className={`w-full flex items-center gap-3 hover:bg-gray-50 p-2 rounded transition-colors ${
                      filterRating === star ? 'bg-green-50 ring-2 ring-[#74B72E]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1 w-16">
                      <span className="font-medium">{star}</span>
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </button>
                );
              })}
            </div>
            {filterRating > 0 && (
              <button
                onClick={() => setFilterRating(0)}
                className="mt-4 text-sm text-[#74B72E] hover:underline"
              >
                Clear filter
              </button>
            )}
          </motion.div>

          {/* Write Review Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="card">
              <h3 className="font-semibold text-lg mb-4">Share Your Experience</h3>
              
              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn-primary w-full"
                >
                  Write a Review
                </button>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      value={newReview.author}
                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74B72E]"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <StarRating
                      rating={newReview.rating}
                      size={32}
                      interactive
                      onChange={(rating) => setNewReview({ ...newReview, rating })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your Review</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74B72E] min-h-[120px]"
                      placeholder="Share your thoughts about this product..."
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      type="submit" 
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-2 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74B72E]"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          <p className="text-sm text-gray-600">
            Showing {sortedReviews.length} of {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          <AnimatePresence>
            {sortedReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-[#74B72E] flex items-center justify-center text-white font-bold flex-shrink-0">
                    <User size={24} />
                  </div>

                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{review.author}</h4>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              <Check size={12} />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <StarRating rating={review.rating} size={16} />
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        className={`flex items-center gap-2 text-sm transition-colors ${
                          helpfulClicks[review.id]
                            ? 'text-[#74B72E]'
                            : 'text-gray-600 hover:text-[#74B72E]'
                        }`}
                        disabled={helpfulClicks[review.id]}
                      >
                        <ThumbsUp size={16} className={helpfulClicks[review.id] ? 'fill-current' : ''} />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sortedReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No reviews match your filter</p>
              <button
                onClick={() => setFilterRating(0)}
                className="text-[#74B72E] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
