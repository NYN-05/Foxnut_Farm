import { motion } from 'framer-motion';

const HeroSection = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      const offset = 80; // Header height
      const elementPosition = productsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const iconFeatures = [
    { icon: '/icons/celebration.jpg', label: 'Guilt Free Snack' },
    { icon: '/icons/leaf.jpg', label: 'Sustainably Harvested' },
    { icon: '/icons/wheat.jpg', label: 'Organic Farm' },
    { icon: '/icons/handshake.jpg', label: 'Community Empowered' }
  ];

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-background.png"
          alt="Fresh foxnuts on lotus leaves in natural farm setting"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center text-white">
        <motion.div {...fadeInUp}>
          <h1 className="heading-1-white mb-6 text-shadow">
            The Ancient Superfood,<br />Farm Fresh to You
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white max-w-3xl mx-auto" style={{ color: '#FFF7E6' }}>
            Discover the natural goodness of premium foxnuts (makhana), sustainably harvested 
            and traditionally processed for your healthiest snacking.
          </p>
          <button 
            onClick={scrollToProducts}
            className="btn-hero text-lg" 
            aria-label="Shop for foxnuts - scroll to products section"
          >
            Shop for Foxnuts
          </button>
        </motion.div>

        {/* Icon Features */}
        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {iconFeatures.map((feature, index) => (
            <div 
              key={index}
              className="relative rounded-2xl overflow-hidden h-40 
                         transition-all duration-300 hover:scale-105 group focus-within:ring-2 focus-within:ring-white"
              style={{ backgroundColor: '#FFFFFF' }}
              role="article"
              aria-label={feature.label}
            >
              <img 
                src={feature.icon} 
                alt={`${feature.label} - Foxnuts Farm commitment`}
                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
              />
              <div 
                className="absolute bottom-0 left-0 right-0 p-4 text-center"
                style={{ 
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                }}
              >
                <p className="text-sm md:text-base font-semibold text-white">
                  {feature.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
