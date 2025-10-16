import { useState } from 'react';
import { ArrowLeft, CheckCircle2, MapPin, Phone, Mail, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CartItem } from '../lib/database.types';

interface CheckoutProps {
  cartItems: CartItem[];
  cartTotal: number;
  onOrderComplete: () => void;
  onBack: () => void;
}

export default function Checkout({
  cartItems,
  cartTotal,
  onOrderComplete,
  onBack,
}: CheckoutProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    orderType: 'delivery' as 'delivery' | 'takeout' | 'dine_in',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderNum = `ORD-${Date.now()}`;

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNum,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_email: formData.customerEmail,
          delivery_address: formData.deliveryAddress,
          order_type: formData.orderType,
          notes: formData.notes,
          subtotal: cartTotal,
          total: cartTotal,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      for (const item of cartItems) {
        const itemTotal =
          item.product.price +
          item.selectedExtras.reduce((sum, e) => sum + e.price, 0);

        const { data: orderItemData, error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderData.id,
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: itemTotal,
            notes: item.notes || '',
          })
          .select()
          .single();

        if (itemError) throw itemError;

        if (item.selectedExtras.length > 0) {
          const extraInserts = item.selectedExtras.map(extra => ({
            order_item_id: orderItemData.id,
            extra_id: extra.id,
            extra_price: extra.price,
          }));

          const { error: extrasError } = await supabase
            .from('order_item_extras')
            .insert(extraInserts);

          if (extrasError) throw extrasError;
        }
      }

      setOrderNumber(orderNum);
      setOrderSuccess(true);

      setTimeout(() => {
        onOrderComplete();
      }, 3000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            ¡Pedido Confirmado!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido recibido y está siendo preparado
          </p>
          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Número de Orden</p>
            <p className="text-2xl font-bold text-amber-900">{orderNumber}</p>
          </div>
          <p className="text-sm text-gray-500">
            Redirigiendo a la página principal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-amber-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-amber-800 hover:text-amber-900 mb-6 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Volver</span>
        </button>

        <h1 className="text-4xl font-bold text-amber-900 mb-8">
          Finalizar Pedido
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">
                Información de Contacto
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={e =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={e =>
                      setFormData({ ...formData, customerPhone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="555-1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={e =>
                      setFormData({ ...formData, customerEmail: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="juan@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Pedido *
                  </label>
                  <select
                    required
                    value={formData.orderType}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        orderType: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="delivery">Domicilio</option>
                    <option value="takeout">Para Llevar</option>
                    <option value="dine_in">Comer Aquí</option>
                  </select>
                </div>

                {formData.orderType === 'delivery' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Dirección de Entrega *
                    </label>
                    <textarea
                      required={formData.orderType === 'delivery'}
                      value={formData.deliveryAddress}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          deliveryAddress: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Calle, número, colonia, referencias..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notas Especiales
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Instrucciones especiales, alergias, etc."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </span>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => {
                  const itemTotal =
                    (item.product.price +
                      item.selectedExtras.reduce((sum, e) => sum + e.price, 0)) *
                    item.quantity;

                  return (
                    <div key={index} className="border-b pb-3">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-gray-800">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="font-bold text-green-700">
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>
                      {item.selectedExtras.length > 0 && (
                        <div className="text-xs text-gray-600 ml-4">
                          Extras: {item.selectedExtras.map(e => e.name).join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-700">Subtotal:</span>
                  <span className="font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl">
                  <span className="font-bold text-amber-900">Total:</span>
                  <span className="font-bold text-green-700">
                    ${cartTotal.toFixed(2)} MXN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
