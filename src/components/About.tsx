import React from 'react';
import { Award, Users, Truck, Shield } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: <Award className="h-8 w-8" />, value: '15+', label: 'Years Experience' },
    { icon: <Users className="h-8 w-8" />, value: '5000+', label: 'Happy Customers' },
    { icon: <Truck className="h-8 w-8" />, value: '50K+', label: 'Orders Delivered' },
    { icon: <Shield className="h-8 w-8" />, value: '100%', label: 'Quality Assured' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              About <span className="text-yellow-500">ACERO</span> <span className="text-slate-800">HOME OF STEEL</span>
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              For over 15 years, Acero Steel has been the trusted name in premium steel supply. 
              We serve contractors, manufacturers, and individual customers with the highest quality 
              steel products and exceptional service.
            </p>
            <p className="text-lg text-slate-600 mb-8">
              Our state-of-the-art facility houses an extensive inventory of steel products, 
              from standard sizes to custom specifications. We pride ourselves on competitive 
              pricing, fast delivery, and technical expertise.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-fade-in-right">
            <img 
              src="/images/istockphoto-2165812916-1024x1024.jpg"
              alt="Acero Steel Warehouse"
              className="rounded-lg shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-slate-900 p-6 rounded-lg shadow-lg animate-scale-in animate-delay-300">
              <div className="text-2xl font-bold">Premium Quality</div>
              <div className="text-sm">Certified Steel Products</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
