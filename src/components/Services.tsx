import React from 'react';
import { Truck, Users, Shield, Clock } from 'lucide-react';

const Services: React.FC = () => {
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
    window.open('tel:+263772280562', '_self');
  };

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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Why Choose Acero Steel?</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We provide comprehensive steel solutions with unmatched service and reliability
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center group animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 hover:rotate-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
              <p className="text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-center animate-scale-in animate-delay-500">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Ready to Place an Order?</h3>
          <p className="text-lg text-slate-800 mb-6">Get instant quotes and competitive pricing for all your steel needs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleRequestQuote}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors btn-enhanced ripple-effect"
            >
              Request Quote
            </button>
            <button 
              onClick={handleCallNow}
              className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors btn-enhanced ripple-effect"
            >
              Call Now: +263 772 280 562
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;