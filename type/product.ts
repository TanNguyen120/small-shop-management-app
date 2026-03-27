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

  // Core Information
  name: z.string().min(1, 'Product name is required'),
  barcode: z.string().nullable().optional(),

  // 💰 FIX: Remove .default() and ensure they are just coerced numbers
  // to match your defaultValues: { cost_price: 0 }
  cost_price: z.coerce.number().min(0).catch(0),
  wholesale_price: z.coerce.number().min(0).catch(0),
  retail_price: z.coerce.number().min(0).catch(0),

  // Inventory & Status
  stock_quantity: z.coerce.number().int().catch(0),
  is_active: z.boolean().default(true),

  // Metadata - Keep these as they are if they can be null/undefined
  manufacturer: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

/**
 * TypeScript Type inferred from the Zod Schema
 */
export type Product = z.infer<typeof productSchema>;

/**
 * Type for creating a new product (omitting DB-generated fields)
 */
export type CreateProductInput = z.input<typeof productSchema>;
