import { Product } from '@/type/product'; // Your existing Zod-inferred type

/** * Represents the raw structure from your Vietnamese CSV export
 */
export interface RawCsvRow {
  'Tên hàng hóa': string;
  'Mã hàng hóa'?: string;
  'Nhóm hàng'?: string;
  'Nhà sản xuất'?: string;
  'Giá vốn'?: string | number;
  'Giá bán'?: string | number;
  'Giá sỉ'?: string | number;
  'Giá vip'?: string | number;
  'Số lượng'?: string | number;
  'Đơn vị'?: string;
  'Mô tả'?: string;
  'Tồn kho tối thiếu'?: string | number;
  VAT?: string | number;
}
// // 💰 Helper: Remove commas and convert to clean number
// const parseCurrency = (val: string | number | undefined): number => {
//   if (val === undefined || val === null || val === '') return 0;
//   if (typeof val === 'number') return val;
//   // Strip commas and non-numeric characters (except decimals)
//   const cleaned = val.replace(/,/g, '').replace(/[^0-9.]/g, '');
//   return parseFloat(cleaned) || 0;
// };
// // ✅ Helper: Convert "Có" / "Không" to Boolean
// const parseBool = (val: string | undefined): boolean => {
//   if (!val) return false;
//   const normalized = val.trim().toLowerCase();
//   return normalized === 'có' || normalized === 'true' || normalized === 'yes';
// };
/**
 * Maps Vietnamese CSV data to your Supabase/Zod Product schema
 */
export const mapCsvToProductSchema = (row: RawCsvRow): Partial<Product> => {
  console.log('Mapping CSV Row:', row);

  // Helper to handle both "38,000" strings and raw numbers
  const parseNumber = (val: string | number | undefined): number => {
    if (val === undefined || val === null || val === '') return 0;
    if (typeof val === 'number') return val;
    const cleaned = val.replace(/,/g, '').replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  return {
    // 🏷️ Core Info (Using 'Tên hàng hóa' and 'Mã hàng hóa')
    name: row['Tên hàng hóa']?.trim() ?? 'Sản phẩm không tên',
    product_id: row['Mã hàng hóa']?.trim() || undefined,
    barcode: row['Mã hàng hóa']?.trim() || null, // Mapping Mã hàng hóa to barcode

    // 💰 Pricing
    cost_price: parseNumber(row['Giá vốn']),
    retail_price: parseNumber(row['Giá bán']),
    wholesale_price: parseNumber(row['Giá sỉ']),
    // Note: If your schema supports VIP price, you can add it here:
    // vip_price: parseNumber(row['Giá vip']),

    // 📦 Inventory & Meta
    stock_quantity: parseNumber(row['Số lượng']),

    // Defaulting to true since "Hiển thị" isn't in this specific JSON snippet
    is_active: true,

    category: row['Nhóm hàng']?.trim() || 'Mặc định',
    manufacturer: row['Nhà sản xuất']?.trim() || null,

    // Additional fields from your JSON
    // description: row['Mô tả']?.trim() || null,
    // unit: row['Đơn vị']?.trim() || null,
  };
};

/**
 * Batch processor for the CSV array
 */
export const processProductCsv = (csvData: RawCsvRow[]): Partial<Product>[] => {
  console.log('Processing CSV Data:', csvData); // Debug log to check the raw CSV data structure
  return csvData
    .filter((row) => !!row['Tên hàng hóa']) // Ensure row isn't empty
    .map(mapCsvToProductSchema);
};
