import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import FeaturedProducts from './components/FeaturedProducts'
import FarmSection from './components/FarmSection'
import QuizSection from './components/QuizSection'
import SustainabilityMeter from './components/SustainabilityMeter'
import RecipeSection from './components/RecipeSection'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import CartPanel from './components/CartPanel'
import { products } from './data/products'

function App() {
  const [activeSection, setActiveSection] = useState('hero')

  const handleNavigation = (section) => {
    setActiveSection(section)
  }

  return (
    <div className="app smooth-scroll">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#74B72E',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#E76F51',
              secondary: '#fff',
            },
          },
        }}
      />
      <Header onNavigate={handleNavigation} products={products} />
      <CartPanel />
      <main id="main-content" style={{ paddingTop: '80px' }}>
        <div id="hero">
          <HeroSection />
        </div>
        <div id="products">
          <FeaturedProducts />
        </div>
        <div id="farm">
          <FarmSection />
        </div>
        <div id="quiz">
          <QuizSection />
        </div>
        <div id="sustainability">
          <SustainabilityMeter />
        </div>
        <div id="recipes">
          <RecipeSection />
        </div>
        <Footer />
        <BackToTop />
      </main>
    </div>
  )
}

export default App
