import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import TablesView from './components/TablesView';
import Footer from './components/Footer';
import type { CartItem } from './lib/database.types';

type View = 'home' | 'menu' | 'checkout' | 'tables';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.product.id === item.product.id &&
        JSON.stringify(i.selectedExtras) === JSON.stringify(item.selectedExtras)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }

      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const updateCartItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const extrasTotal = item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    return total + (item.product.price + extrasTotal) * item.quantity;
  }, 0);

  const handleOrderComplete = () => {
    clearCart();
    setCurrentView('home');
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={setCurrentView}
        currentView={currentView}
      />

      <main className="pt-20">
        {currentView === 'home' && (
          <>
            <Hero onExploreMenu={() => setCurrentView('menu')} />
            <Menu onAddToCart={addToCart} />
          </>
        )}

        {currentView === 'menu' && (
          <Menu onAddToCart={addToCart} />
        )}

        {currentView === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            cartTotal={cartTotal}
            onOrderComplete={handleOrderComplete}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'tables' && (
          <TablesView />
        )}
      </main>

      <Footer />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        total={cartTotal}
        onUpdateQuantity={updateCartItemQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCurrentView('checkout');
          setIsCartOpen(false);
        }}
      />
    </div>
  );
}

export default App;
