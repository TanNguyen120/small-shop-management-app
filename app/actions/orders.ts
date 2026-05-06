'use server';

import { createClient } from '@/lib/supabase/server'; // Verify this path
import { revalidatePath } from 'next/cache';

interface CartItem {
  id: string;
  name: string;
  barcode: string;
  retail_price: number;
  quantity: number;
}

export async function saveOrderAction(
  items: CartItem[],
  total: number,
  discount: number,
) {
  const supabase = await createClient();

  // 1. Authenticate user on server
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return {
      success: false,
      error: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.',
    };
  }

  // 2. Prepare items
  const formattedItems = items.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
    unit_price_paid: item.retail_price,
  }));

  // 3. Call RPC with the authenticated user.id
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
