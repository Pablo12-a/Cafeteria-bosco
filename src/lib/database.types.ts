export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          is_featured: boolean;
          intensity_level: number | null;
          is_hot: boolean;
          is_available: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      extras: {
        Row: {
          id: string;
          name: string;
          price: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['extras']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['extras']['Insert']>;
      };
      product_extras: {
        Row: {
          product_id: string;
          extra_id: string;
        };
        Insert: Database['public']['Tables']['product_extras']['Row'];
        Update: Partial<Database['public']['Tables']['product_extras']['Insert']>;
      };
      restaurant_tables: {
        Row: {
          id: string;
          table_number: number;
          seats: number;
          status: 'available' | 'occupied' | 'reserved';
          current_order_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['restaurant_tables']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['restaurant_tables']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          table_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string;
          delivery_address: string;
          order_type: 'dine_in' | 'delivery' | 'takeout';
          status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
          notes: string;
          subtotal: number;
          total: number;
          created_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          notes: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
      order_item_extras: {
        Row: {
          order_item_id: string;
          extra_id: string;
          extra_price: number;
        };
        Insert: Database['public']['Tables']['order_item_extras']['Row'];
        Update: Partial<Database['public']['Tables']['order_item_extras']['Insert']>;
      };
    };
  };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Extra = Database['public']['Tables']['extras']['Row'];
export type RestaurantTable = Database['public']['Tables']['restaurant_tables']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];

export interface ProductWithExtras extends Product {
  extras?: Extra[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedExtras: Extra[];
  notes?: string;
}

export interface TableWithOrder extends RestaurantTable {
  current_order?: Order & {
    items: (OrderItem & { product: Product })[];
  };
}
