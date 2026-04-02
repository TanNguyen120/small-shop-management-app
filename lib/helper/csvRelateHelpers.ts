import { Product } from '@/type/product'; // Your existing Zod-inferred type

/** * Represents the raw structure from your Vietnamese CSV export
 */
interface RawCsvRow {
  'Tên sản phẩm': string;
  'Mã sản phẩm'?: string;
  'Nhóm hàng'?: string;
  'Nhà sản xuất'?: string;
  'Giá vốn'?: string | number;
  'Giá bán'?: string | number;
  'Giá sỉ'?: string | number;
  'Số lượng'?: string | number;
  'Đơn vị'?: string;
  'Trọng lượng'?: string;
  'Quản lý tồn kho?'?: string;
  'Hiển thị ra website'?: string;
}
// 💰 Helper: Remove commas and convert to clean number
const parseCurrency = (val: string | number | undefined): number => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return val;
  // Strip commas and non-numeric characters (except decimals)
  const cleaned = val.replace(/,/g, '').replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};
// ✅ Helper: Convert "Có" / "Không" to Boolean
const parseBool = (val: string | undefined): boolean => {
  if (!val) return false;
  const normalized = val.trim().toLowerCase();
  return normalized === 'có' || normalized === 'true' || normalized === 'yes';
};
/**
 * Maps Vietnamese CSV data to your Supabase/Zod Product schema
 */
export const mapCsvToProductSchema = (row: RawCsvRow): Partial<Product> => {
  console.log('Mapping CSV Row:', row); // Debug log to check the incoming row structure
  return {
    // 🏷️ Core Info
    name: row['Tên sản phẩm']?.trim() ?? 'Sản phẩm không tên',
    product_id: row['Mã sản phẩm']?.trim() || undefined,

    // 💰 Pricing
    cost_price: parseCurrency(row['Giá vốn']),
    retail_price: parseCurrency(row['Giá bán']),
    wholesale_price: parseCurrency(row['Giá sỉ']),

    // 📦 Inventory & Meta
    stock_quantity: parseCurrency(row['Số lượng']), // Reusing currency parser for comma-separated counts
    is_active: parseBool(row['Hiển thị ra website']),

    category: row['Nhóm hàng']?.trim() || null,
    manufacturer: row['Nhà sản xuất']?.trim() || null,

    // Using Product ID as the barcode if barcode column is missing
    barcode: row['Mã sản phẩm']?.trim() || null,
  };
};

/**
 * Batch processor for the CSV array
 */
export const processProductCsv = (csvData: RawCsvRow[]): Partial<Product>[] => {
  console.log('Processing CSV Data:', csvData); // Debug log to check the raw CSV data structure
  return csvData
    .filter((row) => !!row['Tên sản phẩm']) // Ensure row isn't empty
    .map(mapCsvToProductSchema);
};
