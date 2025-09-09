import React, { useState } from 'react';
import { Lock, ShoppingCart, MessageSquare } from 'lucide-react';
import AuthModal from './AuthModal';

interface AuthGuardProps {
  children: React.ReactNode;
  action: 'cart' | 'quote' | 'contact';
  onAuthSuccess?: () => void;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, action, onAuthSuccess }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const getActionInfo = () => {
    switch (action) {
      case 'cart':
        return {
          title: 'Sign in to Add to Cart',
          description: 'Please sign in to add items to your cart and place orders.',
          icon: <ShoppingCart className="h-8 w-8 text-blue-600" />
        };
      case 'quote':
        return {
          title: 'Sign in to Get Quote',
          description: 'Please sign in to request quotes and get personalized pricing.',
          icon: <MessageSquare className="h-8 w-8 text-blue-600" />
        };
      case 'contact':
        return {
          title: 'Sign in to Contact Us',
          description: 'Please sign in to send us messages and inquiries.',
          icon: <MessageSquare className="h-8 w-8 text-blue-600" />
        };
      default:
        return {
          title: 'Authentication Required',
          description: 'Please sign in to continue.',
          icon: <Lock className="h-8 w-8 text-blue-600" />
        };
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  const actionInfo = getActionInfo();

  return (
    <>
      <div 
        className="relative group cursor-pointer"
        onClick={() => setShowAuthModal(true)}
      >
        {children}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            {actionInfo.icon}
            <h3 className="font-semibold text-slate-800 mt-2">{actionInfo.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{actionInfo.description}</p>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
};

export default AuthGuard;
