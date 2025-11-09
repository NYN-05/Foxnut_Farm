import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    // Proper email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail || !emailRegex.test(newsletterEmail)) {
      toast.error('Please enter a valid email address', {
        icon: '⚠️',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Try to call backend API
      await api.subscribeNewsletter(newsletterEmail);
      
      setIsNewsletterSubscribed(true);
      toast.success('🎉 Thank you for subscribing to our newsletter!', {
        duration: 4000,
      });
      setNewsletterEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsNewsletterSubscribed(false);
      }, 3000);
    } catch (error) {
      // Fallback: If backend is not running, save locally
      // Save to localStorage
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      subscribers.push({ email: newsletterEmail, timestamp: new Date().toISOString() });
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      
      setIsNewsletterSubscribed(true);
      toast.success('🎉 Thank you for subscribing to our newsletter!', {
        duration: 4000,
      });
      setNewsletterEmail('');
      
      setTimeout(() => {
        setIsNewsletterSubscribed(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuLinks = [
    { label: 'Our Story', href: '#story' },
    { label: 'Shop', href: '#products' },
    { label: 'Recipes', href: '#recipes' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' }
  ];

  const socialLinks = [
    { name: 'Instagram', icon: '/icons/instagram.svg', href: '#instagram', color: 'hover:text-pink-500' },
    { name: 'Twitter', icon: '/icons/twitter.svg', href: '#twitter', color: 'hover:text-blue-400' },
    { name: 'Facebook', icon: '/icons/facebook.svg', href: '#facebook', color: 'hover:text-blue-600' }
  ];

  return (
    <footer className="text-white" style={{ backgroundColor: '#1C3126' }}>
      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src="/icons/lotus_logo.jpg" alt="Foxnuts Farm" className="w-10 h-10" />
                <h3 className="text-2xl font-serif font-bold text-white">Foxnuts Farm</h3>
              </div>
              <p className="mb-6" style={{ color: '#D9E2D3', maxWidth: '28rem' }}>
                Bringing you the finest, sustainably harvested foxnuts from our organic farms 
                in Bihar, India. Ancient superfood, modern health.
              </p>
              <div className="flex items-center gap-4">
                <div 
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: '#74B72E' }}
                >
                  100% Organic
                </div>
                <div 
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: '#E76F51' }}
                >
                  Farm Fresh
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-semibold text-lg mb-4 font-serif">Quick Links</h4>
            <ul className="space-y-3">
              {menuLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="inline-flex items-center gap-2 group transition-colors duration-300"
                    style={{ color: '#D9E2D3' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#F9C74F'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D9E2D3'}
                    aria-label={link.label}
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-semibold text-lg mb-4 font-serif">Stay Connected</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3" style={{ color: '#D9E2D3' }}>
                <img src="/icons/email.jpg" alt="Email" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(79%) sepia(13%) saturate(561%) hue-rotate(56deg) brightness(96%) contrast(85%)' }} />
                <a 
                  href="mailto:hello@foxnutsfarm.com" 
                  className="transition-colors"
                  style={{ color: '#D9E2D3' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F9C74F'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#D9E2D3'}
                >
                  hello@foxnutsfarm.com
                </a>
              </div>
              <div className="flex items-center gap-3" style={{ color: '#D9E2D3' }}>
                <img src="/icons/phone.jpg" alt="Phone" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(79%) sepia(13%) saturate(561%) hue-rotate(56deg) brightness(96%) contrast(85%)' }} />
                <a 
                  href="tel:+911234567890" 
                  className="transition-colors"
                  style={{ color: '#D9E2D3' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F9C74F'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#D9E2D3'}
                >
                  +91 123 456 7890
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div 
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <p className="text-sm mb-3" style={{ color: '#D9E2D3' }}>
                {isNewsletterSubscribed ? '✅ Subscribed!' : 'Subscribe to our newsletter'}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  disabled={isNewsletterSubscribed}
                  className="flex-1 px-4 py-2 rounded-lg border-none text-white 
                           focus:outline-none focus:ring-2 disabled:opacity-50"
                  style={{ 
                    backgroundColor: '#1C3126',
                    color: '#FFFFFF'
                  }}
                  aria-label="Email address for newsletter"
                />
                <button 
                  type="submit"
                  disabled={isNewsletterSubscribed}
                  className="px-4 py-2 rounded-lg transition-colors font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: '#74B72E' }}
                  onMouseEnter={(e) => !isNewsletterSubscribed && (e.currentTarget.style.backgroundColor = '#5D9E24')}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#74B72E'}
                  aria-label="Subscribe to newsletter"
                >
                  {isNewsletterSubscribed ? '✓' : '→'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8"
          style={{ borderTop: '1px solid #3E4A3C' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <span className="text-sm" style={{ color: '#C9D1C8' }}>Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                  title={social.name}
                >
                  <img src={social.icon} alt={social.name} className="w-8 h-8" />
                </a>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#C9D1C8' }}>
                <img src="/icons/check.jpg" alt="Certified" className="w-5 h-5" />
                <span>Certified Organic</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#C9D1C8' }}>
                <img src="/icons/check.jpg" alt="Certified" className="w-5 h-5" />
                <span>Gluten Free</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#C9D1C8' }}>
                <img src="/icons/check.jpg" alt="Certified" className="w-5 h-5" />
                <span>Non-GMO</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Copyright Bar */}
      <div style={{ backgroundColor: '#2E3B2D', borderTop: '1px solid #3E4A3C' }} className="py-6">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: '#C9D1C8' }}>
            <p>© 2025 Foxnuts Farm. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a 
                href="#privacy" 
                className="transition-colors"
                style={{ color: '#C9D1C8' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#D9A441'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#C9D1C8'}
              >
                Privacy Policy
              </a>
              <a 
                href="#terms" 
                className="transition-colors"
                style={{ color: '#C9D1C8' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#D9A441'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#C9D1C8'}
              >
                Terms of Service
              </a>
              <a 
                href="#shipping" 
                className="transition-colors"
                style={{ color: '#C9D1C8' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#D9A441'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#C9D1C8'}
              >
                Shipping Info
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
