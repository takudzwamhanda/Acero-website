import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-yellow-400">ACERO</span>
              <span className="text-white ml-1">HOME OF STEEL</span>
            </div>
            <p className="text-slate-300 mb-4">
              Your trusted partner for premium steel products. Quality, reliability, and service excellence since day one.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Round Steel Bars</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Square Tubes</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Angle Iron</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Flat Bars</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">I-Beams</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Custom Cuts</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Retail Sales</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Wholesale Orders</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Custom Fabrication</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Delivery Service</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Technical Support</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Quality Testing</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-yellow-400" />
                <span>+263 772 280 562</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-yellow-400" />
                <span>info@acerosteel.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-yellow-400 mt-1" />
                <span>123 Industrial Blvd<br />Steel City, SC 12345</span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-yellow-400 mt-1" />
                <span>Mon-Fri: 7AM-6PM<br />Sat: 8AM-4PM<br />Sun: Closed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 Acero Steel Supply. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;