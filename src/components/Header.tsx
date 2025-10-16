import { Coffee, ShoppingCart, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onNavigate: (view: 'home' | 'menu' | 'checkout' | 'tables') => void;
  currentView: string;
}

export default function Header({ cartItemsCount, onCartClick, onNavigate, currentView }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <Coffee className="w-10 h-10 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider">Cafetería Bosco</h1>
              <p className="text-xs text-amber-200">Café del Bosque</p>
            </div>
          </button>

          <nav className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'home'
                  ? 'bg-white text-amber-900 font-semibold'
                  : 'hover:bg-amber-700'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => onNavigate('menu')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'menu'
                  ? 'bg-white text-amber-900 font-semibold'
                  : 'hover:bg-amber-700'
              }`}
            >
              Menú
            </button>
            <button
              onClick={() => onNavigate('tables')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                currentView === 'tables'
                  ? 'bg-white text-amber-900 font-semibold'
                  : 'hover:bg-amber-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Mesas</span>
            </button>
            <button
              onClick={onCartClick}
              className="relative px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                  {cartItemsCount}
                </span>
              )}
              <span>Carrito</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
