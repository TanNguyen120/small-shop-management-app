import { z } from 'zod';

/**
 * Zod Schema matching your Supabase 'product' table.
 * Includes auto-generated fields as optional to support both
 * Insert (new) and Select (existing) operations.
 */
export const productSchema = z.object({
  // ... Database Generated fields stay the same
  id: z.string().uuid().optional(),
  product_id: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  user_id: z.string().uuid().optional(), // Added for multi-tenancy

  // Core Information
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  barcode: z.string().min(1, 'Mã vạch là bắt buộc').nullable().optional(),

  // 💰 FIX: Remove .default() and ensure they are just coerced numbers
  cost_price: z.coerce.number().min(0).catch(0),
  wholesale_price: z.coerce.number().min(0).catch(0),
  retail_price: z.coerce.number().min(0).catch(0),

  // Inventory & Status
  stock_quantity: z.coerce.number().int().catch(0),
  is_active: z.boolean().default(true),

  // Metadata
  manufacturer: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

/**
 * Alias for user's preferred naming convention
 */
export const ProductSchema = productSchema;

/**
 * TypeScript Type inferred from the Zod Schema
 */
export type Product = z.infer<typeof productSchema>;

/**
 * Type for creating a new product (omitting DB-generated fields)
 */
export type CreateProductInput = z.input<typeof productSchema>;
