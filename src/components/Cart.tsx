import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../lib/database.types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  onCheckout: () => void;
}

export default function Cart({
  isOpen,
  onClose,
  items,
  total,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 transform transition-transform flex flex-col">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Mi Carrito</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-amber-800 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-500 mb-6">
              Agrega productos del menú para comenzar tu pedido
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all"
            >
              Ver Menú
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item, index) => {
                const itemTotal =
                  (item.product.price +
                    item.selectedExtras.reduce((sum, e) => sum + e.price, 0)) *
                  item.quantity;

                return (
                  <div
                    key={index}
                    className="bg-amber-50 rounded-lg p-4 shadow hover:shadow-md transition-all"
                  >
                    <div className="flex space-x-4">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-amber-900">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => onRemove(index)}
                            className="text-red-500 hover:text-red-700 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.selectedExtras.length > 0 && (
                          <div className="text-xs text-gray-600 mb-2">
                            <span className="font-semibold">Extras:</span>
                            {item.selectedExtras.map((extra, i) => (
                              <span key={extra.id}>
                                {i > 0 ? ', ' : ' '}
                                {extra.name} (+${extra.price.toFixed(2)})
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 bg-white rounded-lg p-1">
                            <button
                              onClick={() =>
                                onUpdateQuantity(index, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-semibold text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(index, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-bold text-green-700 text-lg">
                            ${itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t bg-white p-6 space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold text-gray-700">Subtotal:</span>
                <span className="font-bold text-gray-900">
                  ${total.toFixed(2)} MXN
                </span>
              </div>

              <div className="flex items-center justify-between text-2xl">
                <span className="font-bold text-amber-900">Total:</span>
                <span className="font-bold text-green-700">
                  ${total.toFixed(2)} MXN
                </span>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
              >
                Proceder al Pago
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
