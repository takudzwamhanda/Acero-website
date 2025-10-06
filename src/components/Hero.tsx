import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from './AuthGuard';

const Hero: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBrowseProducts = () => {
    scrollToSection('#products');
  };

  const handleGetQuote = () => {
    scrollToSection('#contact');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url('/images/rect-tube.jfif')`
        }}
      />
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 lg:py-32">
        <div className="max-w-4xl">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up animate-delay-200">
            <span className="text-yellow-400">ACERO</span>
            <span className="block text-white">HOME OF STEEL</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-300 mb-8 max-w-2xl leading-relaxed animate-fade-in-up animate-delay-300">
            Your trusted partner for high-quality steel products. From retail to wholesale, 
            we deliver strength and reliability for every construction project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up animate-delay-400">
            <button 
              onClick={handleBrowseProducts}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center group btn-enhanced ripple-effect"
            >
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {isAuthenticated ? (
              <button 
                onClick={handleGetQuote}
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 btn-enhanced ripple-effect"
              >
                Get Quote
              </button>
            ) : (
              <AuthGuard action="quote">
                <button 
                  className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 btn-enhanced ripple-effect"
                >
                  Get Quote
                </button>
              </AuthGuard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
