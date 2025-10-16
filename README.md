# Cafetería Bosco - Sistema de Gestión

Sistema completo para la Cafetería Bosco con gestión de menú, pedidos y mesas.

## Características Implementadas

### ✅ Sistema de Menú
- **5 Categorías**: Desayunos, Cafés, Bebidas Calientes, Bebidas Frías y Frappés
- **Productos con imágenes**: Cada producto tiene foto, descripción y precio
- **Extras personalizables**: Leche de almendra, shots extra, crema batida, etc.
- **Indicadores visuales**: Íconos de caliente/frío, nivel de intensidad para cafés

### ✅ Carrito de Compras
- **Sidebar deslizable**: Se abre al agregar productos
- **Gestión de cantidades**: Aumentar/disminuir cantidad de cada item
- **Resumen en tiempo real**: Total calculado automáticamente con extras
- **Personalización**: Muestra los extras seleccionados por producto

### ✅ Sistema de Pedidos
- **Checkout en un paso**: Formulario simple y claro
- **Tipos de pedido**: Domicilio, Para Llevar, Comer Aquí
- **Confirmación visual**: Pantalla de éxito con número de orden
- **Almacenamiento en BD**: Todos los pedidos se guardan en Supabase

### ✅ Gestión de Mesas (POS)
- **10 mesas configuradas**: Con diferentes capacidades (2, 4, 6, 8 personas)
- **Vista en tiempo real**: Estado de cada mesa (Disponible, Ocupada, Reservada)
- **Detalles de pedidos**: Click en mesa para ver orden completa
- **Actualización de estados**: Pendiente → En Preparación → Listo → Completado
- **Liberación automática**: Al completar orden, la mesa se libera

### ✅ Diseño Profesional
- **Paleta de colores**: Marrón/Crema/Verde (bosque y café)
- **100% Responsive**: Funciona en móviles, tablets y desktop
- **Animaciones suaves**: Hover effects, transiciones, carrusel automático
- **Hero con carrusel**: Productos destacados rotando automáticamente

### ✅ Base de Datos Completa
- Categorías y productos
- Extras y relaciones producto-extras
- Mesas y órdenes
- Items de orden con extras
- Row Level Security configurado

## Cómo Ejecutar en Visual Studio Code

### 1. Abrir el Proyecto

```bash
# Abre Visual Studio Code
code .
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Verificar Variables de Entorno

El archivo `.env` ya está configurado con tu base de datos Supabase. Verifica que exista:

```
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_key
```

### 4. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

El servidor se iniciará automáticamente (usualmente en `http://localhost:5173`)

### 5. Comandos Adicionales

```bash
# Construir para producción
npm run build

# Verificar tipos TypeScript
npm run typecheck

# Linting
npm run lint

# Vista previa de producción
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── Header.tsx          # Navegación principal
│   ├── Hero.tsx            # Banner con carrusel
│   ├── Menu.tsx            # Lista de productos por categoría
│   ├── ProductCard.tsx     # Tarjeta individual de producto
│   ├── Cart.tsx            # Carrito lateral
│   ├── Checkout.tsx        # Página de pago
│   ├── TablesView.tsx      # Gestión de mesas (POS)
│   └── Footer.tsx          # Pie de página
├── lib/
│   ├── supabase.ts         # Cliente de Supabase
│   └── database.types.ts   # Tipos TypeScript
├── App.tsx                 # Componente principal
├── main.tsx               # Punto de entrada
└── index.css              # Estilos globales
```

## Navegación del Sistema

### Vista Cliente
1. **Inicio**: Hero con carrusel de productos destacados
2. **Menú**: Navega por categorías y agrega productos al carrito
3. **Carrito**: Revisa y modifica tu pedido
4. **Checkout**: Completa la información y confirma

### Vista POS (Mesas)
1. Click en botón "Mesas" en el header
2. Ver estado de todas las mesas
3. Click en mesa ocupada para ver detalles del pedido
4. Actualizar estado del pedido según preparación
5. Completar orden para liberar la mesa

## Base de Datos

### Tablas Principales:
- `categories`: Categorías del menú
- `products`: Productos con precios e imágenes
- `extras`: Complementos personalizables
- `restaurant_tables`: Mesas del restaurante
- `orders`: Pedidos de clientes
- `order_items`: Items individuales de cada pedido

### Datos Precargados:
- 5 categorías
- 18 productos (desayunos, cafés, bebidas, frappés)
- 7 extras
- 10 mesas

## Flujo de Trabajo

### Cliente hace un pedido:
1. Navega el menú y selecciona productos
2. Personaliza con extras si desea
3. Agrega al carrito
4. Va al checkout
5. Llena formulario (nombre, teléfono, dirección)
6. Confirma pedido
7. Recibe número de orden

### Staff gestiona el pedido:
1. Ve nueva orden en vista de Mesas
2. Cambia estado a "En Preparación"
3. Cuando está listo → "Listo"
4. Cliente recibe → "Completado"
5. Mesa se libera automáticamente

## Características Técnicas

- **Framework**: React 18 + TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: Supabase (PostgreSQL)
- **Iconos**: Lucide React
- **Build Tool**: Vite
- **Type Safety**: TypeScript estricto

## Notas Importantes

1. **Horarios de Desayuno**: 6am - 12pm (mostrado en footer)
2. **Auto-refresh**: Vista de mesas se actualiza cada 10 segundos
3. **Precios**: Todos en MXN (Pesos Mexicanos)
4. **Responsive**: Optimizado para todos los dispositivos
5. **Estados de Orden**: pending → preparing → ready → completed

## Soporte

Para cualquier duda o problema, revisa:
- Los logs en la consola del navegador (F12)
- Verifica la conexión a Supabase
- Confirma que todas las dependencias están instaladas

---

**¡Disfruta del sistema Cafetería Bosco!** ☕🌳
