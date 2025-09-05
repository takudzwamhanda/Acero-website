import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleCart, getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Products', href: '#products' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Close mobile menu after navigation
  };

  const handleGetQuote = () => {
    scrollToSection('#contact');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent backdrop-blur-md shadow-lg'
    }`}>
      {/* Top Contact Bar */}
      <div className={`border-b ${isScrolled ? 'border-slate-200' : 'border-white/20'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            <a 
              href="tel:+263772280562" 
              className={`flex items-center space-x-1 ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-white hover:text-yellow-400'} transition-colors`}
            >
              <Phone className="h-3 w-3" />
              <span>+263 772 280 562</span>
            </a>
            <a 
              href="mailto:info@acerosteel.com" 
              className={`flex items-center space-x-1 ${isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-white hover:text-yellow-400'} transition-colors`}
            >
              <Mail className="h-3 w-3" />
              <span>info@acerosteel.com</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">
              <span className="text-yellow-500">ACERO</span>
              <span className={`ml-1 ${isScrolled ? 'text-slate-800' : 'text-white'}`}>HOME OF STEEL</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-yellow-400'} font-medium transition-colors nav-link`}
              >
                {item.name}
              </button>
            ))}
            
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className={`relative ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-yellow-400'} transition-colors`}
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-yellow-400'}`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-yellow-400'} font-medium py-2 text-left nav-link`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Cart Button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={toggleCart}
                  className="w-full flex items-center justify-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart ({getTotalItems()})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;