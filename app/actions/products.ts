'use server';

import { createClient } from '@/lib/supabase/server';
import { ProductSchema } from '@/type/product';
import { revalidatePath } from 'next/cache';

export async function addProductAction(formData: unknown) {
  const supabase = await createClient();
  
  // 1. Authenticate user on server
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: "Unauthorized" };

  // 2. Validate input
  const validatedFields = ProductSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.flatten().fieldErrors };
  }

  // 3. Insert with forced user_id
  const { error } = await supabase
    .from('product')
    .insert([{ 
      ...validatedFields.data, 
      user_id: user.id 
    }]);

  if (error) return { success: false, error: error.message };

  revalidatePath('/pages/product-list');
  return { success: true };
}

export async function checkBarcodeAction(barcode: string) {
  const supabase = await createClient();

  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Search only within user's products
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .eq('barcode', barcode.trim())
    .eq('user_id', user.id) // Scope to user
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Supabase error:', error);
    return { success: false, error: 'Lỗi kiểm tra mã vạch' };
  }

  if (data) {
    return { success: true, exists: true, product: data };
  }

  return { success: true, exists: false };
}
