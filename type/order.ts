import { z } from 'zod';

export const orderItemSchema = z.object({
  id: z.string().uuid().optional(),
  order_id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1),
  unit_price_paid: z.number().min(0),
  // Optional join fields
  product_name: z.string().optional(),
});

export const orderTransactionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  total_amount: z.number().min(0),
  discount_amount: z.number().min(0).default(0),
  created_at: z.string().datetime(),
  status: z.string().optional(),
  // Relationship
  order_items: z.array(orderItemSchema).optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderTransaction = z.infer<typeof orderTransactionSchema>;
