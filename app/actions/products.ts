'use server';

import { createClient } from '@/lib/supabase/server';

export async function checkBarcodeAction(barcode: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('product')
    .select('*')
    .eq('barcode', barcode.trim())
    .single(); // Use .single() because barcode is UNIQUE

  if (error && error.code !== 'PGRST116') {
    // PGRST116 means "No rows found"
    console.error('Supabase error:', error);
    return { success: false, error: 'Lỗi kiểm tra mã vạch' };
  }

  if (data) {
    return { success: true, exists: true, product: data };
  }

  return { success: true, exists: false };
}
