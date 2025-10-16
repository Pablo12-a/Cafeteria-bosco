import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Flame, Snowflake, Zap } from 'lucide-react';
import type { ProductWithExtras, CartItem, Extra } from '../lib/database.types';

interface ProductCardProps {
  product: ProductWithExtras;
  onAddToCart: (item: CartItem) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [showExtras, setShowExtras] = useState(false);

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e.id === extra.id);
      if (exists) {
        return prev.filter(e => e.id !== extra.id);
      }
      return [...prev, extra];
    });
  };

  const handleAddToCart = () => {
    onAddToCart({
      product,
      quantity,
      selectedExtras,
    });
    setQuantity(1);
    setSelectedExtras([]);
    setShowExtras(false);
  };

  const totalPrice = product.price + selectedExtras.reduce((sum, e) => sum + e.price, 0);

  const renderIntensityIndicator = () => {
    if (!product.intensity_level) return null;

    return (
      <div className="flex items-center space-x-1 mb-2">
        <Zap className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-semibold text-amber-700">Intensidad:</span>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map(level => (
            <div
              key={level}
              className={`w-2 h-4 rounded ${
                level <= product.intensity_level!
                  ? 'bg-amber-600'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          {product.is_hot ? (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-semibold">Caliente</span>
            </div>
          ) : (
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
              <Snowflake className="w-4 h-4" />
              <span className="text-xs font-semibold">Frío</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-amber-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>

        {renderIntensityIndicator()}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-green-700">
            ${totalPrice.toFixed(2)}
          </span>
          {selectedExtras.length > 0 && (
            <span className="text-xs text-gray-500">
              (Base: ${product.price.toFixed(2)})
            </span>
          )}
        </div>

        {product.extras && product.extras.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowExtras(!showExtras)}
              className="text-sm text-amber-700 hover:text-amber-900 font-semibold mb-2"
            >
              {showExtras ? '▼' : '▶'} Personalizar ({product.extras.length} extras)
            </button>

            {showExtras && (
              <div className="space-y-2 bg-amber-50 p-3 rounded-lg">
                {product.extras.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-amber-100 p-2 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedExtras.some(e => e.id === extra.id)}
                        onChange={() => toggleExtra(extra)}
                        className="w-4 h-4 text-amber-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{extra.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-green-700">
                      +${extra.price.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-200 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-200 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
