import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { CartProvider } from '@/contexts/CartContext';
import Navigation from './Navigation';
import Hero from './Hero';
import ProductGrid from './ProductGrid';
import Services from './Services';
import About from './About';
import Contact from './Contact';
import Footer from './Footer';
import Cart from './Cart';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Navigation />
        <main>
          <section id="home">
            <Hero />
          </section>
          <section id="products">
            <ProductGrid />
          </section>
          <section id="services">
            <Services />
          </section>
          <section id="about">
            <About />
          </section>
          <section id="contact">
            <Contact />
          </section>
        </main>
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
};

export default AppLayout;
