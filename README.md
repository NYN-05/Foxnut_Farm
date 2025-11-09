# 🪷 Foxnuts Farm - Premium Web Application

A fully responsive, production-ready React web application showcasing Foxnuts Farm's premium, sustainably harvested foxnuts (makhana). Built with modern web technologies and designed to deliver an exceptional user experience.

![Foxnuts Farm](https://img.shields.io/badge/React-19.1.1-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38bdf8) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Latest-ff69b4)

## ✨ Features

### 🎨 Design Highlights
- **Premium Color Palette**: Soft sage green, lavender mauve, and cream white
- **Professional Typography**: Playfair Display for headings, Inter for body text
- **Smooth Animations**: Powered by Framer Motion for engaging user interactions
- **Fully Responsive**: Mobile-first design that works perfectly on all devices

### 🌟 Key Sections

1. **Hero Section**
   - Full-screen immersive banner with gradient overlay
   - Compelling headline and call-to-action
   - Four feature icons (Guilt Free, Sustainable, Organic, Community)
   - Smooth scroll indicator

2. **Featured Products**
   - Three premium product cards with hover effects
   - Beautiful gradient backgrounds
   - Add to cart functionality
   - Responsive grid layout

3. **Farm Section**
   - Interactive farm location display
   - Live statistics (7,500+ bags sold)
   - Customer testimonial showcase
   - Farm metrics cards

4. **Personality Quiz**
   - Interactive 3-question quiz
   - Progress tracking with visual indicators
   - Personalized product recommendations
   - Beautiful result display with circular progress chart

5. **Sustainability Meter**
   - Animated progress bars showing environmental metrics
   - 90% Water Recycled, 100% Organic Farming
   - Premium subscription box promotion
   - Compelling benefits display

6. **Footer**
   - Comprehensive site navigation
   - Newsletter subscription
   - Social media links
   - Contact information
   - Trust badges

### 🚀 Bonus Features
- ✅ **Back to Top Button**: Floating button for easy navigation
- ✅ **Smooth Scroll Animations**: Framer Motion transitions on scroll
- ✅ **Lazy Loading Ready**: Optimized for performance
- ✅ **WCAG AA Compliant**: Accessible design with proper ARIA labels
- ✅ **SEO Optimized**: Semantic HTML structure

## 🛠️ Technology Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 3.x
- **Animations**: Framer Motion
- **Icons**: Emoji-based (zero external dependencies)
- **Fonts**: Google Fonts (Playfair Display, Inter)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v20.19.0 or higher recommended)
- npm or yarn package manager

### Quick Start

1. **Clone or navigate to the project directory**
   ```bash
   cd foxnutS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The app will hot-reload as you make changes

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
foxnutS/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── HeroSection.jsx
│   │   ├── FeaturedProducts.jsx
│   │   ├── FarmSection.jsx
│   │   ├── QuizSection.jsx
│   │   ├── SustainabilityMeter.jsx
│   │   ├── Footer.jsx
│   │   └── BackToTop.jsx
│   ├── App.jsx           # Main app component
│   ├── App.css           # Component styles
│   ├── index.css         # Global styles & Tailwind
│   └── main.jsx          # Entry point
├── index.html            # HTML template
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies
└── README.md            # This file
```

## 🎨 Component Overview

### `HeroSection.jsx`
Full-screen hero with background image, headline, CTA, and four feature icons with hover effects.

### `FeaturedProducts.jsx`
Product showcase with three cards, each featuring product image, description, price, and add-to-cart button.

### `FarmSection.jsx`
Farm story section with location map, statistics, testimonial overlay, and farm metrics.

### `QuizSection.jsx`
Interactive personality quiz with progress tracking, multiple-choice questions, and personalized results.

### `SustainabilityMeter.jsx`
Environmental commitment display with animated progress bars and subscription promotion card.

### `Footer.jsx`
Comprehensive footer with navigation links, newsletter signup, social media, and trust badges.

### `BackToTop.jsx`
Floating button that appears on scroll, smoothly returns user to top of page.

## 🎯 Customization Guide

### Colors
Edit `tailwind.config.js` to modify the color palette:
```javascript
colors: {
  sage: { /* Your sage green variations */ },
  mauve: { /* Your mauve variations */ },
  cream: { /* Your cream variations */ }
}
```

### Typography
Fonts are configured in `tailwind.config.js`:
```javascript
fontFamily: {
  serif: ['"Playfair Display"', 'serif'],
  sans: ['"Inter"', 'sans-serif'],
}
```

### Content
Update product data, testimonials, and text directly in component files.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast meets WCAG AA standards
- Focus states on all interactive elements
- Alt text ready for images

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Performance Optimizations

- Component-based architecture for code splitting
- Framer Motion animations with GPU acceleration
- Optimized images (use WebP format recommended)
- Lazy loading ready structure
- Minimal dependencies

## 📄 License

This project is created for Foxnuts Farm. All rights reserved.

## 🤝 Contributing

This is a custom project for Foxnuts Farm. For modifications or enhancements, please contact the development team.

## 📞 Support

For technical support or questions:
- Email: hello@foxnutsfarm.com
- Phone: +91 123 456 7890

## 🙏 Acknowledgments

- Design inspired by modern e-commerce best practices
- Built with love for sustainable farming and healthy snacking
- Emoji icons for visual appeal and zero external dependencies

---

**Built with ❤️ for Foxnuts Farm** 🪷

*Bringing ancient superfoods to modern tables through exceptional digital experiences.*
