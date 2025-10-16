import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard';
import type { Category, ProductWithExtras, CartItem, Extra } from '../lib/database.types';

interface MenuProps {
  onAddToCart: (item: CartItem) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductWithExtras[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    setLoading(true);

    const [categoriesResult, productsResult, extrasResult, productExtrasResult] = await Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('products').select('*').eq('is_available', true),
      supabase.from('extras').select('*'),
      supabase.from('product_extras').select('*'),
    ]);

    if (categoriesResult.data) {
      setCategories(categoriesResult.data);
      if (categoriesResult.data.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesResult.data[0].id);
      }
    }

    if (productsResult.data && extrasResult.data && productExtrasResult.data) {
      const productsWithExtras = productsResult.data.map(product => {
        const productExtraIds = productExtrasResult.data
          .filter(pe => pe.product_id === product.id)
          .map(pe => pe.extra_id);

        const productExtras = extrasResult.data.filter(extra =>
          productExtraIds.includes(extra.id)
        );

        return {
          ...product,
          extras: productExtras,
        };
      });

      setProducts(productsWithExtras);
    }

    setLoading(false);
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, string> = {
      Sunrise: '☀️',
      Coffee: '☕',
      Flame: '🔥',
      Snowflake: '❄️',
      IceCream: '🍦',
    };
    return icons[iconName] || '📋';
  };

  return (
    <div className="py-12 bg-amber-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-amber-900 text-center mb-8">
          Nuestro Menú
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-8 flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg'
                      : 'bg-white text-amber-900 hover:bg-amber-100 shadow'
                  }`}
                >
                  <span className="text-xl">{getIconComponent(category.icon)}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600">
                  No hay productos disponibles en esta categoría
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
