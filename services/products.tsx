import { supabase } from '@/lib/supabase/supabase'; // Your supabase client
import { Product } from '@/type/product'; // Your Zod schema type

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .order('created_at', { ascending: false }); // Show newest first

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message);
  }

  return data as Product[];
};
