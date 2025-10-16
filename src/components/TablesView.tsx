import { useEffect, useState } from 'react';
import { RefreshCw, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { TableWithOrder, Order, OrderItem, Product } from '../lib/database.types';

export default function TablesView() {
  const [tables, setTables] = useState<TableWithOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<TableWithOrder | null>(null);

  useEffect(() => {
    loadTables();
    const interval = setInterval(loadTables, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadTables = async () => {
    try {
      const { data: tablesData, error: tablesError } = await supabase
        .from('restaurant_tables')
        .select('*')
        .order('table_number');

      if (tablesError) throw tablesError;

      const tablesWithOrders: TableWithOrder[] = [];

      for (const table of tablesData || []) {
        if (table.current_order_id) {
          const { data: orderData } = await supabase
            .from('orders')
            .select('*')
            .eq('id', table.current_order_id)
            .maybeSingle();

          if (orderData) {
            const { data: itemsData } = await supabase
              .from('order_items')
              .select('*, product:products(*)')
              .eq('order_id', orderData.id);

            tablesWithOrders.push({
              ...table,
              current_order: {
                ...orderData,
                items: itemsData || [],
              } as any,
            });
          } else {
            tablesWithOrders.push(table);
          }
        } else {
          tablesWithOrders.push(table);
        }
      }

      setTables(tablesWithOrders);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', orderId);

      if (error) throw error;

      if (status === 'completed') {
        const order = tables.find(t => t.current_order?.id === orderId)?.current_order;
        if (order?.table_id) {
          await supabase
            .from('restaurant_tables')
            .update({ status: 'available', current_order_id: null })
            .eq('id', order.table_id);
        }
      }

      loadTables();
      setSelectedTable(null);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al actualizar el estado del pedido');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800 border-green-300',
      occupied: 'bg-amber-100 text-amber-800 border-amber-300',
      reserved: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getOrderStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getOrderStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Pendiente',
      preparing: 'En Preparación',
      ready: 'Listo',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-amber-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-amber-900">
            Gestión de Mesas
          </h1>
          <button
            onClick={loadTables}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Actualizar</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {tables.map(table => (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={`p-6 rounded-xl border-2 ${getStatusColor(
                table.status
              )} hover:shadow-lg transition-all transform hover:scale-105`}
            >
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">Mesa {table.table_number}</div>
                <div className="flex items-center justify-center space-x-1 text-sm mb-2">
                  <Users className="w-4 h-4" />
                  <span>{table.seats} personas</span>
                </div>
                <div className="font-semibold text-xs uppercase tracking-wider">
                  {table.status === 'available' && 'Disponible'}
                  {table.status === 'occupied' && 'Ocupada'}
                  {table.status === 'reserved' && 'Reservada'}
                </div>
                {table.current_order && (
                  <div className={`mt-2 px-2 py-1 rounded text-xs font-semibold ${getOrderStatusColor(table.current_order.status)}`}>
                    {getOrderStatusText(table.current_order.status)}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {selectedTable && selectedTable.current_order && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 sticky top-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Mesa {selectedTable.table_number}
                    </h2>
                    <p className="text-amber-100 text-sm">
                      Orden: {selectedTable.current_order.order_number}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTable(null)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-amber-800 rounded-full transition-all"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-amber-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Cliente:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedTable.current_order.customer_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Teléfono:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedTable.current_order.customer_phone}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <p className={`inline-block px-2 py-1 rounded font-semibold text-xs ${getOrderStatusColor(selectedTable.current_order.status)}`}>
                        {getOrderStatusText(selectedTable.current_order.status)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">
                        {new Date(selectedTable.current_order.created_at).toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-amber-900 mb-4">
                  Productos Ordenados
                </h3>

                <div className="space-y-3 mb-6">
                  {selectedTable.current_order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.quantity}x {item.product.name}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-gray-600">{item.notes}</p>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-green-700">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {selectedTable.current_order.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Notas Especiales:
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedTable.current_order.notes}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-2xl font-bold">
                    <span className="text-amber-900">Total:</span>
                    <span className="text-green-700">
                      ${selectedTable.current_order.total.toFixed(2)} MXN
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {selectedTable.current_order.status === 'pending' && (
                    <button
                      onClick={() =>
                        updateOrderStatus(selectedTable.current_order!.id, 'preparing')
                      }
                      className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Iniciar Preparación
                    </button>
                  )}
                  {selectedTable.current_order.status === 'preparing' && (
                    <button
                      onClick={() =>
                        updateOrderStatus(selectedTable.current_order!.id, 'ready')
                      }
                      className="py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Marcar Listo
                    </button>
                  )}
                  {selectedTable.current_order.status === 'ready' && (
                    <button
                      onClick={() =>
                        updateOrderStatus(selectedTable.current_order!.id, 'completed')
                      }
                      className="py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Completar y Liberar Mesa</span>
                    </button>
                  )}
                  {selectedTable.current_order.status !== 'completed' &&
                    selectedTable.current_order.status !== 'cancelled' && (
                    <button
                      onClick={() =>
                        updateOrderStatus(selectedTable.current_order!.id, 'cancelled')
                      }
                      className="py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Cancelar Orden
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
