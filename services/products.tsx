import { createClient } from '@/lib/supabase/server';
import { Product } from '@/type/product';

export const fetchProducts = async (): Promise<Product[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message);
  }

  return data as Product[];
};
