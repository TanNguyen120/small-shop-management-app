import { createClient } from '@supabase/supabase-js';

// Define the Database schema types for better Autocomplete
export interface Database {
  public: {
    Tables: {
      product: {
        Row: {
          id: string;
          product_id: string | null;
          name: string;
          barcode: string | null;
          cost_price: number;
          wholesale_price: number;
          retail_price: number;
          stock_quantity: number;
          is_active: boolean;
          category: string | null;
          manufacturer: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          name: string;
          barcode?: string | null;
          cost_price?: number;
          wholesale_price?: number;
          retail_price?: number;
          stock_quantity?: number;
          is_active?: boolean;
          category?: string | null;
          manufacturer?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          name?: string;
          barcode?: string | null;
          cost_price?: number;
          wholesale_price?: number;
          retail_price?: number;
          stock_quantity?: number;
          is_active?: boolean;
          category?: string | null;
          manufacturer?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_transactions: {
        Row: {
          id: string;
          user_id: string;
          total_amount: number;
          discount_amount: number;
          created_at: string;
          status: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_amount: number;
          discount_amount?: number;
          created_at?: string;
          status?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_amount?: number;
          discount_amount?: number;
          created_at?: string;
          status?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price_paid: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price_paid: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price_paid?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Standard Supabase Client for Client-Side Operations
 * Use this in your TanStack Form or UI components.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
