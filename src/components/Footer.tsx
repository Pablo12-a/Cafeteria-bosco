import { Coffee, Clock, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-amber-900 to-amber-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Coffee className="w-8 h-8" />
              <h3 className="text-xl font-bold">Cafetería Bosco</h3>
            </div>
            <p className="text-amber-200 text-sm">
              Café artesanal y desayunos frescos en un ambiente acogedor inspirado en el bosque
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Horarios</h4>
            <div className="space-y-2 text-amber-200 text-sm">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Desayunos</p>
                  <p>6:00 AM - 12:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Horario General</p>
                  <p>Lunes - Domingo</p>
                  <p>6:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <div className="space-y-3 text-amber-200 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Calle del Bosque 123, Centro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+52 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@cafeteriabosco.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-amber-700 hover:bg-amber-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-amber-700 hover:bg-amber-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-amber-700 hover:bg-amber-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <div className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center">
                ¡Delivery Disponible!
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-700 mt-8 pt-8 text-center text-amber-200 text-sm">
          <p>© 2025 Cafetería Bosco. Todos los derechos reservados.</p>
          <p className="mt-2">
            Hecho con <span className="text-red-400">♥</span> para amantes del café
          </p>
        </div>
      </div>
    </footer>
  );
}
