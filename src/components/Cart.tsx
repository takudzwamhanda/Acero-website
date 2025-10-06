import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const Cart: React.FC = () => {
  const {
    items,
    isOpen,
    toggleCart,
    updateQuantity,
    updatePriceType,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const [includeDelivery, setIncludeDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const [deliveryLoad, setDeliveryLoad] = useState('standard');

  const formatPrice = (price: string) => {
    return price.replace(/[^0-9.]/g, '');
  };

  const getDeliveryCost = () => {
    if (!includeDelivery || deliveryDistance <= 0) return 0;
    
    // Base cost per mile
    const baseCostPerMile = 2.50;
    
    // Load multiplier based on order weight/size
    const totalPrice = getTotalPrice();
    let loadMultiplier = 1.0;
    
    if (deliveryLoad === 'light') {
      loadMultiplier = 0.8; // 20% discount for light loads
    } else if (deliveryLoad === 'heavy') {
      loadMultiplier = 1.5; // 50% increase for heavy loads
    } else if (deliveryLoad === 'bulk') {
      loadMultiplier = 2.0; // 100% increase for bulk orders
    }
    
    // Distance-based pricing
    let distanceCost = deliveryDistance * baseCostPerMile;
    
    // Apply distance discounts for longer hauls
    if (deliveryDistance > 50) {
      distanceCost *= 0.9; // 10% discount for 50+ miles
    }
    if (deliveryDistance > 100) {
      distanceCost *= 0.85; // Additional 15% discount for 100+ miles
    }
    
    // Apply load multiplier
    const finalCost = distanceCost * loadMultiplier;
    
    // Minimum delivery cost
    return Math.max(finalCost, 15);
  };

  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const delivery = includeDelivery ? getDeliveryCost() : 0;
    return subtotal + delivery;
  };

  const getDepositAmount = () => {
    const finalTotal = getFinalTotal();
    return finalTotal * 0.5; // 50% deposit
  };

  const getRemainingAmount = () => {
    const finalTotal = getFinalTotal();
    const deposit = getDepositAmount();
    return finalTotal - deposit;
  };

  const handleCheckout = () => {
    // Create order summary
    const orderSummary = createOrderSummary();
    
    // Show checkout options
    showCheckoutOptions(orderSummary);
    toggleCart();
  };

  const createOrderSummary = () => {
    const totalItems = getTotalItems();
    const subtotal = getTotalPrice();
    const deliveryCost = includeDelivery ? getDeliveryCost() : 0;
    const finalTotal = getFinalTotal();
    
    let summary = `🛒 *ACERO STEEL ORDER*\n\n`;
    summary += `📋 *Order Summary:*\n`;
    
    items.forEach((item, index) => {
      const price = item.priceType === 'wholesale' ? item.wholesalePrice : item.retailPrice;
      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
      const itemTotal = (numericPrice * item.quantity).toFixed(2);
      
      summary += `${index + 1}. ${item.name}\n`;
      summary += `   📏 ${item.specifications}\n`;
      summary += `   💰 ${price} (${item.priceType})\n`;
      summary += `   📦 Quantity: ${item.quantity} pieces = $${itemTotal}\n\n`;
    });
    
    summary += `💰 *Subtotal: $${subtotal.toFixed(2)}*\n`;
    
    if (includeDelivery) {
      summary += `🚚 *Delivery: $${deliveryCost.toFixed(2)}*\n`;
      summary += `📏 *Distance: ${deliveryDistance} miles*\n`;
      summary += `📦 *Load Type: ${deliveryLoad.charAt(0).toUpperCase() + deliveryLoad.slice(1)}*\n`;
      if (deliveryAddress) {
        summary += `📍 *Delivery Address: ${deliveryAddress}*\n`;
      }
    } else {
      summary += `🏪 *Pickup at store*\n`;
    }
    
    summary += `💰 *Final Total: $${finalTotal.toFixed(2)}*\n`;
    
    if (includeDelivery) {
      summary += `\n💳 *PAYMENT TERMS:*\n`;
      summary += `💰 *Required Deposit (50%): $${getDepositAmount().toFixed(2)}*\n`;
      summary += `💰 *Remaining on Delivery: $${getRemainingAmount().toFixed(2)}*\n`;
      summary += `⚠️ *Deposit must be paid before delivery scheduling*\n`;
    }
    
    summary += `📦 *Total Items: ${totalItems}*\n\n`;
    summary += `Please provide your contact details${includeDelivery ? ', confirm delivery address, and arrange deposit payment' : ''}.`;
    
    return summary;
  };

  const showCheckoutOptions = (orderSummary: string) => {
    // Create modal-like overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    
    const modal = document.createElement('div');
    modal.className = 'bg-white rounded-lg p-6 max-w-md w-full';
    modal.innerHTML = `
      <h3 class="text-xl font-bold text-slate-800 mb-4">Choose Checkout Method</h3>
      <p class="text-slate-600 mb-6">How would you like to complete your order?</p>
      <div class="space-y-3">
        <button id="whatsapp-btn" class="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
          <span>📱</span>
          <span>WhatsApp</span>
        </button>
        <button id="email-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
          <span>📧</span>
          <span>Email</span>
        </button>
        <button id="sms-btn" class="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
          <span>💬</span>
          <span>SMS</span>
        </button>
      </div>
      <button id="cancel-btn" class="w-full mt-4 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-lg font-semibold transition-colors">
        Cancel
      </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Add event listeners
    const whatsappBtn = modal.querySelector('#whatsapp-btn');
    const emailBtn = modal.querySelector('#email-btn');
    const smsBtn = modal.querySelector('#sms-btn');
    const cancelBtn = modal.querySelector('#cancel-btn');
    
    const closeModal = () => {
      overlay.remove();
    };
    
    whatsappBtn?.addEventListener('click', () => {
      closeModal();
      openWhatsApp(orderSummary);
    });
    
    emailBtn?.addEventListener('click', () => {
      closeModal();
      openEmail(orderSummary);
    });
    
    smsBtn?.addEventListener('click', () => {
      closeModal();
      openSMS(orderSummary);
    });
    
    cancelBtn?.addEventListener('click', closeModal);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  };

  const openWhatsApp = (orderSummary: string) => {
    const phoneNumber = '263774637836'; // Your WhatsApp number
    const message = encodeURIComponent(orderSummary);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const openEmail = (orderSummary: string) => {
    const email = 'info@acerosteel.com';
    const subject = encodeURIComponent('Steel Products Order - Acero Steel');
    const body = encodeURIComponent(orderSummary);
    const emailUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(emailUrl);
  };

  const openSMS = (orderSummary: string) => {
    const phoneNumber = '263774637836';
    const message = encodeURIComponent(orderSummary);
    const smsUrl = `sms:${phoneNumber}?body=${message}`;
    window.open(smsUrl);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleCart}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-white to-yellow-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="flex flex-col h-full min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-yellow-200 bg-yellow-100">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">
                Cart ({getTotalItems()})
              </h2>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 pb-0">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">Your cart is empty</p>
                <p className="text-slate-400 text-sm mt-2">
                  Add some steel products to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white border border-yellow-200 rounded-lg p-4 animate-fade-in-up shadow-sm">
                    <div className="flex space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-600 truncate">
                          {item.specifications}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.category}
                        </p>
                        
                        {/* Price Type Toggle */}
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => updatePriceType(item.id, 'retail')}
                            className={`px-2 py-1 text-xs rounded ${
                              item.priceType === 'retail'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            } transition-colors`}
                          >
                            Retail
                          </button>
                          <button
                            onClick={() => updatePriceType(item.id, 'wholesale')}
                            className={`px-2 py-1 text-xs rounded ${
                              item.priceType === 'wholesale'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            } transition-colors`}
                          >
                            Wholesale
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 rounded transition-colors"
                        >
                          <Minus className="h-4 w-4 text-slate-600" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            updateQuantity(item.id, newQuantity);
                          }}
                          className="w-16 text-center font-medium border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 rounded transition-colors"
                        >
                          <Plus className="h-4 w-4 text-slate-600" />
                        </button>
                        <span className="text-xs text-slate-500 ml-2">pieces</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800">
                          ${(parseFloat(formatPrice(item.priceType === 'wholesale' ? item.wholesalePrice : item.retailPrice)) * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-yellow-200 p-6 space-y-4 bg-yellow-50 overflow-y-auto max-h-96">
              {/* Delivery Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="delivery-checkbox"
                    checked={includeDelivery}
                    onChange={(e) => setIncludeDelivery(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="delivery-checkbox" className="text-sm font-medium text-slate-700">
                    🚚 Include Delivery
                  </label>
                </div>
                
                {includeDelivery && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter delivery address..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Distance (miles)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={deliveryDistance}
                          onChange={(e) => setDeliveryDistance(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Load Type
                        </label>
                        <select
                          value={deliveryLoad}
                          onChange={(e) => setDeliveryLoad(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="light">🪶 Light</option>
                          <option value="standard">📦 Standard</option>
                          <option value="heavy">🏋️ Heavy</option>
                          <option value="bulk">🚛 Bulk</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <p className="text-xs text-slate-600">
                        <span className="font-medium">Delivery: ${getDeliveryCost().toFixed(2)}</span>
                        <br />
                        <span className="text-slate-500">
                          {deliveryDistance > 0 ? `${deliveryDistance}mi × $2.50` : 'Enter distance'} 
                          {deliveryLoad !== 'standard' && ` × ${deliveryLoad === 'light' ? '0.8' : deliveryLoad === 'heavy' ? '1.5' : '2.0'}`}
                        </span>
                      </p>
                    </div>
                    
                    {/* Deposit Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-blue-600">💳</span>
                        <span className="text-xs font-semibold text-blue-800">Payment Terms</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Deposit (50%):</span>
                          <span className="font-medium text-blue-800">${getDepositAmount().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">On Delivery:</span>
                          <span className="font-medium text-blue-800">${getRemainingAmount().toFixed(2)}</span>
                        </div>
                        <p className="text-blue-600 mt-1 text-xs">
                          💡 Deposit required before scheduling
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                </div>
                {includeDelivery && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Delivery:</span>
                    <span className="font-medium">${getDeliveryCost().toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-yellow-300 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-800">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${getFinalTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {/* Deposit Breakdown */}
                {includeDelivery && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-blue-800">Deposit (50%):</span>
                        <span className="text-sm font-bold text-blue-600">
                          ${getDepositAmount().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-blue-700">On Delivery:</span>
                        <span className="text-sm font-medium text-blue-800">
                          ${getRemainingAmount().toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        ⚠️ Deposit required before scheduling
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900 py-3 px-4 rounded-lg font-semibold transition-colors btn-enhanced ripple-effect"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
