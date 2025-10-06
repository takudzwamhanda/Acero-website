import React from 'react';
import { ShoppingCart, Info } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from './AuthGuard';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  retailPrice: string;
  wholesalePrice: string;
  specifications: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  retailPrice,
  wholesalePrice,
  specifications,
  category
}) => {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      image,
      retailPrice,
      wholesalePrice,
      specifications,
      category,
    });
  };

  const handleInfo = () => {
    // Show product details modal or alert
    alert(`Product: ${name}\nCategory: ${category}\nSpecifications: ${specifications}\nRetail Price: ${retailPrice}\nWholesale Price: ${wholesalePrice}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group animate-float">
      <div className="relative overflow-hidden rounded-t-xl">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{name}</h3>
        <p className="text-slate-600 text-sm mb-4">{specifications}</p>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Retail:</span>
            <span className="text-lg font-bold text-slate-800">{retailPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Wholesale:</span>
            <span className="text-lg font-bold text-blue-600">{wholesalePrice}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {isAuthenticated ? (
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900 py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 btn-enhanced ripple-effect"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          ) : (
            <AuthGuard action="cart">
              <button 
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900 py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 btn-enhanced ripple-effect"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </AuthGuard>
          )}
          <button 
            onClick={handleInfo}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-colors"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
