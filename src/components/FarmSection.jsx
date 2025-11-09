import { motion } from 'framer-motion';

const FarmSection = () => {
  return (
    <section className="section-padding" style={{ backgroundColor: '#FAFFF7' }}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">Our Farm</h2>
          <div className="flex items-center justify-center gap-3" style={{ color: '#E76F51' }}>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold font-serif">7,500+</span>
              <span className="text-lg">Bags Sold</span>
            </div>
            <img src="/icons/box.jpg" alt="Packages sold" className="w-8 h-8" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Map/Location Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden h-96 relative"
          >
            {/* Map Image */}
            <img 
              src="/farm/farm-location-map.jpg"
              alt="Aerial view map of foxnut farm in Bihar, India showing lotus ponds"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="flex justify-center mb-4">
                  <img src="/icons/location.jpg" alt="Location" className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Bihar, India</h3>
                <p className="text-white/90 mb-6">Where Lotus Grows Best</p>
                <button className="inline-flex items-center gap-2 btn-green px-6 py-3 rounded-full">
                  <img src="/icons/location.jpg" alt="" className="w-5 h-5 invert" />
                  <span className="font-semibold">Visit Our Farm</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Farm Image with Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-2xl shadow-xl h-96 overflow-hidden relative">
              {/* Farm Image */}
              <img 
                src="/farm/lotus-pond-farm.jpg"
                alt="Farmers harvesting foxnuts from lotus ponds in Bihar farm"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Testimonial Bubble */}
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-start gap-4">
                  <img 
                    src="/testimonials/customer-1.jpg"
                    alt="Happy customer Rajesh Kumar"
                    className="flex-shrink-0 w-12 h-12 rounded-full object-cover border-2 border-green-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <img key={star} src="/icons/star.jpg" alt="star" className="w-4 h-4" />
                      ))}
                    </div>
                    <p className="text-sm italic mb-2" style={{ color: '#2E2E2E' }}>
                      "The freshest foxnuts I've ever tasted! You can really taste the quality."
                    </p>
                    <p className="text-xs font-semibold" style={{ color: '#6B8E23' }}>- Rajesh Kumar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div 
              className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4"
              style={{ borderWidth: '4px', borderColor: '#FAF7F2' }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold font-serif" style={{ color: '#7DBE31' }}>100%</div>
                <div className="text-xs mt-1" style={{ color: '#5A5A5A' }}>Organic</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Farm Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: '/icons/lotus.jpg', label: 'Lotus Ponds', value: '50+', color: '#74B72E' },
            { icon: '/icons/farmer.jpg', label: 'Farmers', value: '25+', color: '#3B82F6' },
            { icon: '/icons/plant.jpg', label: 'Organic', value: '100%', color: '#F9C74F' },
            { icon: '/icons/recycle.jpg', label: 'Sustainable', value: '100%', color: '#E76F51' }
          ].map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-xl p-6 shadow-md">
              <div className="flex justify-center mb-2">
                <img src={stat.icon} alt={stat.label} className="w-16 h-16" />
              </div>
              <div className="text-2xl font-bold font-serif mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-sm text-body">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FarmSection;
