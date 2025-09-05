import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, getTotalPrice, clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    
    // Create order summary if cart has items
    let orderSummary = '';
    if (items.length > 0) {
      orderSummary = createOrderSummary();
    }
    
    // Create complete message
    const completeMessage = createCompleteMessage(orderSummary);
    
    // Show submission options
    showSubmissionOptions(completeMessage);
    
    // Reset form and clear cart
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    clearCart();
    setIsSubmitting(false);
  };

  const createOrderSummary = () => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = getTotalPrice();
    
    let summary = `\n🛒 ORDER SUMMARY:\n`;
    summary += `📦 Total Items: ${totalItems}\n`;
    summary += `💰 Total Amount: $${totalPrice.toFixed(2)}\n\n`;
    summary += `📋 ITEMS:\n`;
    
    items.forEach((item, index) => {
      const price = item.priceType === 'wholesale' ? item.wholesalePrice : item.retailPrice;
      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
      const itemTotal = (numericPrice * item.quantity).toFixed(2);
      
      summary += `${index + 1}. ${item.name}\n`;
      summary += `   📏 ${item.specifications}\n`;
      summary += `   💰 ${price} (${item.priceType})\n`;
      summary += `   📦 Quantity: ${item.quantity} pieces = $${itemTotal}\n\n`;
    });
    
    return summary;
  };

  const createCompleteMessage = (orderSummary: string) => {
    let message = `📧 NEW INQUIRY FROM ACERO STEEL WEBSITE\n\n`;
    message += `👤 CUSTOMER DETAILS:\n`;
    message += `Name: ${formData.name}\n`;
    message += `Email: ${formData.email}\n`;
    message += `Phone: ${formData.phone || 'Not provided'}\n`;
    message += `Subject: ${formData.subject}\n\n`;
    message += `💬 MESSAGE:\n${formData.message}\n`;
    
    if (orderSummary) {
      message += orderSummary;
    }
    
    return message;
  };

  const showSubmissionOptions = (completeMessage: string) => {
    // Create modal-like overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    
    const modal = document.createElement('div');
    modal.className = 'bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto';
    modal.innerHTML = `
      <h3 class="text-xl font-bold text-slate-800 mb-4">✅ Form Submitted Successfully!</h3>
      <p class="text-slate-600 mb-4">How would you like to send this inquiry?</p>
      <div class="space-y-3">
        <button id="email-submit-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
          <span>📧</span>
          <span>Send via Email</span>
        </button>
        <button id="whatsapp-submit-btn" class="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
          <span>📱</span>
          <span>Send via WhatsApp</span>
        </button>
        <button id="copy-submit-btn" class="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
          <span>📋</span>
          <span>Copy to Clipboard</span>
        </button>
      </div>
      <button id="close-submit-btn" class="w-full mt-4 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-lg font-semibold transition-colors">
        Close
      </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Add event listeners
    const emailBtn = modal.querySelector('#email-submit-btn');
    const whatsappBtn = modal.querySelector('#whatsapp-submit-btn');
    const copyBtn = modal.querySelector('#copy-submit-btn');
    const closeBtn = modal.querySelector('#close-submit-btn');
    
    const closeModal = () => {
      overlay.remove();
    };
    
    emailBtn?.addEventListener('click', () => {
      closeModal();
      openEmail(completeMessage);
    });
    
    whatsappBtn?.addEventListener('click', () => {
      closeModal();
      openWhatsApp(completeMessage);
    });
    
    copyBtn?.addEventListener('click', () => {
      closeModal();
      copyToClipboard(completeMessage);
    });
    
    closeBtn?.addEventListener('click', closeModal);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  };

  const openEmail = (message: string) => {
    const email = 'info@acerosteel.com';
    const subject = encodeURIComponent('New Inquiry from Acero Steel Website');
    const body = encodeURIComponent(message);
    const emailUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(emailUrl);
  };

  const openWhatsApp = (message: string) => {
    const phoneNumber = '263772280562';
    const whatsappMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyToClipboard = async (message: string) => {
    try {
      await navigator.clipboard.writeText(message);
      alert('Message copied to clipboard! You can now paste it anywhere.');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = message;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Message copied to clipboard!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Get in Touch</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Ready to discuss your steel needs? Contact us for quotes, technical support, or general inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="animate-fade-in-left">
            {/* Contact Image */}
            <div className="mb-8">
              <img 
                src="/images/istockphoto-2165812916-1024x1024.jpg" 
                alt="Steel manufacturing and contact" 
                className="w-full h-64 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Phone</h4>
                  <a 
                    href="tel:+263772280562" 
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    +263 772 280 562
                  </a>
                  <p className="text-sm text-slate-500">Mon-Fri: 7AM-6PM</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Email</h4>
                  <a 
                    href="mailto:info@acerosteel.com" 
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    info@acerosteel.com
                  </a>
                  <p className="text-sm text-slate-500">We respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Address</h4>
                  <p className="text-slate-600">Harare Rd<br />Mbare,Magaba </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Business Hours</h4>
                  <p className="text-slate-600">
                    Monday - Friday: 7:00 AM - 6:00 PM<br />
                    Saturday: 8:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-right">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-enhanced"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-enhanced"
                  required
                />
              </div>
              
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-enhanced"
              />
              
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-enhanced"
                required
              >
                <option value="">Select Subject</option>
                <option value="quote">Request Quote</option>
                <option value="wholesale">Wholesale Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="general">General Question</option>
              </select>
              
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-enhanced"
                required
              ></textarea>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-slate-900 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 btn-enhanced ripple-effect"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                <Send className="h-5 w-5" />
                <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;