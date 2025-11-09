import { motion } from 'framer-motion';
import { useState } from 'react';

const SustainabilityMeter = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (subscriptionEmail && subscriptionEmail.includes('@')) {
      setIsSubscribed(true);
      setShowSubscriptionModal(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setShowSubscriptionModal(false);
        setSubscriptionEmail('');
      }, 3000);
    } else {
      alert('Please enter a valid email address');
    }
  };

  const metrics = [
    { label: 'Water Recycled', value: 90, icon: '/icons/water.jpg', color: '#3B82F6' },
    { label: 'Carbon Neutral', value: 85, icon: '/icons/earth.jpg', color: '#74B72E' },
    { label: 'Organic Farming', value: 100, icon: '/icons/plant.jpg', color: '#F9C74F' },
  ];

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
          <h2 className="heading-2 mb-4">Sustainability Meter</h2>
          <p className="text-body max-w-2xl mx-auto">
            Our commitment to the planet, measured and transparent
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Sustainability Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img src={metric.icon} alt={metric.label} className="w-16 h-16" />
                    <div>
                      <h4 className="font-semibold heading-3">{metric.label}</h4>
                    </div>
                  </div>
                  <div className="text-3xl font-bold font-serif" style={{ color: metric.color }}>
                    {metric.value}%
                  </div>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#EDEDED' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: metric.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.value}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="rounded-xl p-4 text-center bg-white">
                <div className="flex justify-center mb-2">
                  <img src="/icons/no-pesticide.jpg" alt="No pesticides" className="w-14 h-14" />
                </div>
                <div className="text-2xl font-bold font-serif" style={{ color: '#74B72E' }}>Zero</div>
                <div className="text-sm text-body">Pesticides</div>
              </div>
              <div className="rounded-xl p-4 text-center bg-white">
                <div className="flex justify-center mb-2">
                  <img src="/icons/organic-pack.jpg" alt="Biodegradable packaging" className="w-14 h-14" />
                </div>
                <div className="text-2xl font-bold font-serif" style={{ color: '#E76F51' }}>100%</div>
                <div className="text-sm text-body">Biodegradable</div>
              </div>
            </div>
          </motion.div>

          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl shadow-2xl p-8 md:p-12 text-white relative overflow-hidden bg-subscribe-gradient"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <img src="/icons/package.jpg" alt="Subscription" className="w-16 h-16" />
              </div>
              <h3 className="heading-2 text-white mb-4">Never Run Out!</h3>
              <p className="text-xl mb-6" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Subscribe to our monthly delivery and save <strong>15%</strong> on every order
              </p>

              {/* Product Showcase */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden">
                    <img 
                      src="/products/subscription-box.jpg"
                      alt="Premium foxnuts subscription box"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Premium Foxnuts</h4>
                    <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Monthly subscription box</p>
                  </div>
                </div>
                
                <div className="flex gap-3 text-sm">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                    <img src="/icons/money.jpg" alt="Save money" className="w-5 h-5 invert" />
                    <span>Save 15%</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                    <img src="/icons/truck.jpg" alt="Free shipping" className="w-5 h-5 invert" />
                    <span>Free Shipping</span>
                  </div>
                </div>
              </div>

              {/* Subscription Plans */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedPlan === 'monthly' 
                      ? 'bg-white text-[#2F2F2F] shadow-lg' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  aria-label="Select monthly subscription plan"
                  aria-pressed={selectedPlan === 'monthly'}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan('quarterly')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedPlan === 'quarterly' 
                      ? 'bg-white text-[#2F2F2F] shadow-lg' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  aria-label="Select quarterly subscription plan - save 20%"
                  aria-pressed={selectedPlan === 'quarterly'}
                >
                  Quarterly <span className="text-xs">(Save 20%)</span>
                </button>
              </div>

              {/* Subscription Form */}
              <form onSubmit={handleSubscribe} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={subscriptionEmail}
                    onChange={(e) => setSubscriptionEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Email address for subscription"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full font-bold shadow-lg transition-colors bg-white hover:bg-gray-100"
                    style={{ color: '#2F2F2F' }}
                    aria-label="Subscribe to monthly delivery"
                  >
                    Subscribe
                  </button>
                </div>
              </form>

              {/* Success Message */}
              {showSubscriptionModal && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg text-center"
                  role="alert"
                  aria-live="polite"
                >
                  <p className="font-semibold">🎉 Welcome to the Foxnuts family!</p>
                  <p className="text-sm mt-1 opacity-90">Check your email for confirmation.</p>
                </motion.div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleSubscribe}
                  type="button"
                  className="flex-1 px-6 py-4 rounded-full font-bold text-lg shadow-lg transition-colors bg-white hover:bg-gray-100"
                  style={{ color: '#2F2F2F' }}
                  aria-label="Subscribe now and save 15%"
                >
                  Subscribe Now
                </button>
                <button 
                  type="button"
                  className="flex-1 px-6 py-4 rounded-full font-bold text-lg transition-colors 
                           border-2 text-white hover:bg-white/10"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                  aria-label="Learn more about subscription plans"
                >
                  Learn More
                </button>
              </div>

              {/* Benefits */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="flex justify-center mb-1">
                      <img src="/icons/flexible.jpg" alt="Flexible" className="w-12 h-12 invert" />
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Flexible</div>
                  </div>
                  <div>
                    <div className="flex justify-center mb-1">
                      <img src="/icons/quality.jpg" alt="Premium" className="w-12 h-12 invert" />
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Premium</div>
                  </div>
                  <div>
                    <div className="flex justify-center mb-1">
                      <img src="/icons/recycle.jpg" alt="Eco-friendly" className="w-12 h-12 invert" />
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Eco-Friendly</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilityMeter;
