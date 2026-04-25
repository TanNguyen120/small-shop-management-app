import { supabase } from '@/lib/supabase/supabase';
import { OrderTransaction } from '@/type/order';

export const fetchOrders = async (): Promise<OrderTransaction[]> => {
  const { data, error } = await supabase
    .from('order_transactions' as any)
    .select(`
      *,
      order_items (
        *,
        product:product_id (name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error(error.message);
  }

  // Format order_items to include product_name if needed
  const formattedData = (data as any[]).map(order => ({
    ...order,
    order_items: order.order_items?.map((item: any) => ({
      ...item,
      product_name: item.product?.name
    }))
  }));

  return formattedData as OrderTransaction[];
};
