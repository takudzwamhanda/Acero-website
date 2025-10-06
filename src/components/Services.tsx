import React, { useEffect, useRef } from 'react';
import { Truck, Users, Shield, Clock } from 'lucide-react';

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRequestQuote = () => {
    scrollToSection('#contact');
  };

  const handleCallNow = () => {
    window.open('tel:+263774637836', '_self');
  };

  // Function to split text into words for animation
  const splitTextIntoWords = (text: string) => {
    return text.split(' ').map((word, index) => (
      <span key={index} className="word" style={{ marginRight: '0.25rem' }}>
        {word}
      </span>
    ));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Add special handling for text animations
            const textElements = entry.target.querySelectorAll('.animate-words, .animate-slide-in-text, .highlight-text');
            textElements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('animate-in');
              }, index * 200);
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elementsToObserve = [titleRef.current, cardsRef.current, ctaRef.current];
    elementsToObserve.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elementsToObserve.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const services = [
    {
      icon: <Truck className="h-12 w-12" />,
      title: 'Fast Delivery',
      description: 'Same-day delivery available for local orders. Nationwide shipping with tracking.'
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: 'Wholesale & Retail',
      description: 'Competitive pricing for both individual customers and bulk commercial orders.'
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: 'Quality Guarantee',
      description: 'All steel products meet industry standards with certified quality assurance.'
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer service for urgent orders and technical assistance.'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-yellow-50 opacity-50"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-100 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={titleRef}
          className="text-center mb-16 animate-on-scroll animate-slide-in-bottom"
        >
          <h2 className="text-5xl font-bold text-slate-800 mb-6 relative">
            <span className="relative z-10 animate-slide-in-text text-delay-0">Why Choose </span>
            <span className="bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent animate-glow-pulse text-delay-300" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
              Acero Steel
            </span>
            <span className="relative z-10 animate-slide-in-text text-delay-600">?</span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full shimmer-effect"></div>
          </h2>
          <div className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-words text-delay-800">
            {splitTextIntoWords("We provide comprehensive steel solutions with unmatched service and reliability that sets us apart from the competition")}
          </div>
        </div>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 animate-on-scroll"
        >
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`text-center group service-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-slate-100 animate-bounce-in animate-delay-${index * 150}`}
              style={{animationDelay: `${index * 0.15}s`}}
            >
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-8 rounded-full w-28 h-28 mx-auto mb-6 flex items-center justify-center service-icon animate-pulse-custom shadow-lg">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors duration-300 animate-slide-in-text">
                <span className="highlight-text">{service.title}</span>
              </h3>
              <div className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300 animate-words">
                {splitTextIntoWords(service.description)}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '0.1s'}}></div>
            </div>
          ))}
        </div>
        
        <div 
          ref={ctaRef}
          className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 rounded-3xl p-10 text-center relative overflow-hidden animate-on-scroll animate-slide-in-bottom shadow-2xl"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white to-transparent opacity-5 shimmer-effect"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl font-bold text-slate-900 mb-6 animate-icon-bounce">
              <span className="animate-slide-in-text text-delay-0">🔩</span>
              <span className="animate-words text-delay-200">
                {splitTextIntoWords(" Ready to Place an Order?")}
              </span>
            </h3>
            <div className="text-xl text-slate-800 mb-8 max-w-2xl mx-auto leading-relaxed animate-words text-delay-400">
              {splitTextIntoWords("Get instant quotes and competitive pricing for all your steel needs. Join thousands of satisfied customers!")}
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={handleRequestQuote}
                className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 btn-enhanced ripple-effect transform hover:scale-105 hover:shadow-xl animate-bounce-in text-delay-600"
              >
                <span className="animate-slide-in-text">Request Quote</span> 
                <span className="animate-slide-in-text text-delay-100">✨</span>
              </button>
              <button 
                onClick={handleCallNow}
                className="border-3 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 btn-enhanced ripple-effect transform hover:scale-105 hover:shadow-xl animate-bounce-in text-delay-800"
              >
                <span className="animate-slide-in-text">📞 Call Now:</span>
                <span className="animate-slide-in-text text-delay-100"> +263 77 463 7836</span>
              </button>
            </div>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-6 left-6 w-4 h-4 bg-white rounded-full opacity-30 animate-float"></div>
          <div className="absolute top-12 right-8 w-3 h-3 bg-white rounded-full opacity-40 animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-8 left-12 w-2 h-2 bg-white rounded-full opacity-50 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-6 right-6 w-5 h-5 bg-white rounded-full opacity-20 animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>
    </section>
  );
};

export default Services;
