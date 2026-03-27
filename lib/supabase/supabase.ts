import { createClient } from '@supabase/supabase-js';
import { type Product } from '@/type/product';

// Define the Database schema types for better Autocomplete
export type Database = {
  public: {
    Tables: {
      product: {
        Row: Product; // Existing data from DB
        Insert: Omit<
          Product,
          'id' | 'product_id' | 'created_at' | 'updated_at'
        >; // Data to send
        Update: Partial<Omit<Product, 'id' | 'product_id'>>; // Data to change
      };
    };
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Standard Supabase Client for Client-Side Operations
 * Use this in your TanStack Form or UI components.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
