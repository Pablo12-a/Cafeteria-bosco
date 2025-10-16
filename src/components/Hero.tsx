import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/database.types';

interface HeroProps {
  onExploreMenu: () => void;
}

export default function Hero({ onExploreMenu }: HeroProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    if (featuredProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % featuredProducts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredProducts.length]);

  const loadFeaturedProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_available', true)
      .limit(5);

    if (data && !error) {
      setFeaturedProducts(data);
    }
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <div className="relative">
      <div className="relative h-[500px] bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/1907228/pexels-photo-1907228.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-amber-600 animate-pulse" />
              <span className="text-amber-800 font-semibold uppercase tracking-wider text-sm">
                Desayunos 6am - 12pm
              </span>
            </div>
            <h2 className="text-6xl font-bold text-amber-900 mb-4 leading-tight">
              Comienza tu día
              <br />
              <span className="text-green-700">con energía</span>
            </h2>
            <p className="text-xl text-amber-800 mb-8">
              Desayunos frescos, café artesanal y bebidas deliciosas en un ambiente acogedor del bosque
            </p>
            <button
              onClick={onExploreMenu}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Explora Nuestro Menú
            </button>
          </div>
        </div>
      </div>

      {featuredProducts.length > 0 && (
        <div className="bg-white py-8 shadow-md">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">
              Especiales del Día
            </h3>

            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-xl shadow-xl">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="min-w-full">
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 flex items-center space-x-8">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-64 h-64 object-cover rounded-lg shadow-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-3xl font-bold text-amber-900 mb-2">
                            {product.name}
                          </h4>
                          <p className="text-gray-700 mb-4 text-lg">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-4xl font-bold text-green-700">
                              ${product.price.toFixed(2)} MXN
                            </span>
                            <button
                              onClick={onExploreMenu}
                              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all"
                            >
                              Ver Más
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {featuredProducts.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-amber-900" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-amber-900" />
                  </button>

                  <div className="flex justify-center space-x-2 mt-4">
                    {featuredProducts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentSlide ? 'bg-amber-600 w-8' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-green-100">Ingredientes Frescos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">6am - 8pm</div>
              <div className="text-green-100">Abierto Todos los Días</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Artesanal</div>
              <div className="text-green-100">Café de Calidad</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
