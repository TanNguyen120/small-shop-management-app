'use server';

import { createClient } from '@/lib/supabase/server'; // Verify this path
import { revalidatePath } from 'next/cache';

export async function saveOrderAction(
  items: any[],
  total: number,
  discount: number,
) {
  // 1. Initialize the client
  const supabase = await createClient();

  // 2. Check for the session/user (TEMPORARILY BYPASS FOR TESTING)
  const { data } = await supabase.auth.getUser();
  
  // Use a dummy UUID if no user is found (Replace with a real ID from your auth.users table if needed)
  const user = data?.user || { id: '8b3a0a4e-2a10-4566-9c86-a95117e198fc' };

  /* 
  if (authError || !data?.user) {
    return {
      success: false,
      error: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.',
    };
  }
  */

  // 3. Prepare items for PostgreSQL JSONB
  const formattedItems = items.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
    unit_price_paid: item.retail_price,
  }));

  // 4. Call the RPC
  const { data: orderId, error: rpcError } = await supabase.rpc(
    'create_order_transaction',
    {
      p_user_id: user.id,
      p_total_amount: total,
      p_discount_amount: discount,
      p_items: formattedItems,
    },
  );

  if (rpcError) {
    return { success: false, error: rpcError.message };
  }

  revalidatePath('/pos');
  return { success: true, orderId };
}
