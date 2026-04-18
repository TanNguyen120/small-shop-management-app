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

  // 2. Check for the session/user
  // Use try/catch or optional chaining to be safe
  const { data, error: authError } = await supabase.auth.getUser();

  if (authError || !data?.user) {
    return {
      success: false,
      error: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.',
    };
  }

  const user = data.user;

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
