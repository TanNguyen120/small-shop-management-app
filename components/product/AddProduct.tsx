'use client';

import React from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { productSchema } from '@/type/product';
import { supabase } from '@/lib/supabase/supabase';
import { Package, Barcode, DollarSign, Factory, Tag } from 'lucide-react';

// 1. Extract the exact type from the Schema to ensure 1:1 parity
type ProductFormValues = z.input<typeof productSchema>;

export default function ProductForm() {
  // 2. Default values must include ALL fields defined in the schema to avoid "missing property" errors
  const defaultValues: ProductFormValues = {
    name: '',
    cost_price: 0,
    wholesale_price: 0,
    retail_price: 0,
    stock_quantity: 0,
    is_active: true,
    category: '',
    barcode: '', // Added to match schema
    manufacturer: '', // Added to match schema
    product_id: '', // Added to match schema
  };

  const form = useForm({
    defaultValues,
    validators: {
      // 3. Cast to ZodType with the specific FormValues to fix the 'standardSpec' mismatch
      onChange: productSchema as z.ZodType<ProductFormValues>,
    },
    onSubmit: async ({ value }) => {
      if (value) {
        const { error } = await supabase.from('product').insert(value);
        if (error) {
          alert(`Lỗi: ${error.message}`);
        } else {
          alert('Thêm sản phẩm thành công!');
          form.reset();
        }
      }
    },
  });

  // 4. Properly type the price mapping array to fix the .Field 'name' error
  const priceFields = [
    { name: 'cost_price', label: 'Giá vốn', icon: <Tag className='w-3 h-3' /> },
    {
      name: 'wholesale_price',
      label: 'Giá sỉ',
      icon: <DollarSign className='w-3 h-3' />,
    },
    {
      name: 'retail_price',
      label: 'Giá lẻ',
      icon: <DollarSign className='w-3 h-3' />,
    },
  ] as const; // 'as const' makes the names literal strings instead of generic strings

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className='max-w-2xl mx-auto p-6 bg-card border rounded-xl shadow-sm space-y-6'
    >
      <div className='flex items-center gap-2 pb-2 border-b'>
        <Package className='w-5 h-5 text-primary' />
        <h2 className='text-xl font-semibold'>Thêm Sản Phẩm Mới</h2>
      </div>

      {/* --- NEW: Product Name Field --- */}
      <form.Field
        name='name'
        validators={{
          onChange: productSchema.shape.name, // Link to your Zod min(1) rule
        }}
      >
        {(field) => (
          <div className='space-y-1'>
            <label className='text-sm font-medium flex items-center gap-2'>
              Tên sản phẩm <span className='text-destructive'>*</span>
            </label>
            <input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder='VD: Áo thun Cotton Premium'
              className={`w-full p-2.5 border rounded-md shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                field.state.meta.errors.length > 0
                  ? 'border-destructive'
                  : 'border-input'
              }`}
            />
            {field.state.meta.errors.length > 0 && (
              <p className='text-xs text-destructive font-medium'>
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Existing Bảng giá (Price Grid) starts here... */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* ... your priceFields mapping ... */}
      </div>

      {/* ... rest of the form ... */}

      {/* Bảng giá */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {priceFields.map((priceField) => (
          <form.Field key={priceField.name} name={priceField.name}>
            {(field) => (
              <div className='space-y-1'>
                <label className='text-sm font-medium flex items-center gap-1'>
                  {priceField.icon} {priceField.label}
                </label>
                <input
                  type='number'
                  step='0.01'
                  value={field.state.value as number} // Explicitly cast if TS struggles with the union
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className='w-full p-2 border rounded-md'
                />
              </div>
            )}
          </form.Field>
        ))}
      </div>

      {/* Tồn kho & Trạng thái */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <form.Field name='stock_quantity'>
          {(field) => (
            <div className='space-y-1'>
              <label className='text-sm font-medium'>
                SL tồn kho (Cho phép âm)
              </label>
              <input
                type='number'
                value={field.state.value as number}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className='w-full p-2 border rounded-md'
              />
            </div>
          )}
        </form.Field>

        <form.Field name='is_active'>
          {(field) => (
            <div className='flex items-center gap-3 pt-7'>
              <input
                type='checkbox'
                id='active-toggle'
                checked={field.state.value as boolean}
                onChange={(e) => field.handleChange(e.target.checked)}
                className='w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary'
              />
              <label
                htmlFor='active-toggle'
                className='text-sm font-medium cursor-pointer'
              >
                Đang kinh doanh (Active)
              </label>
            </div>
          )}
        </form.Field>
      </div>

      {/* Barcode & Nhà sản xuất */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <form.Field name='barcode'>
          {(field) => (
            <div className='space-y-1'>
              <label className='text-sm font-medium flex items-center gap-2'>
                <Barcode className='w-3 h-3' /> Mã vạch (Barcode)
              </label>
              <input
                value={(field.state.value as string) ?? ''} // Fix: Handle nullable/optional strings
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder='Tự tạo nếu để trống'
                className='w-full p-2 border rounded-md'
              />
            </div>
          )}
        </form.Field>

        <form.Field name='manufacturer'>
          {(field) => (
            <div className='space-y-1'>
              <label className='text-sm font-medium flex items-center gap-2'>
                <Factory className='w-3 h-3' /> Nhà sản xuất
              </label>
              <input
                value={(field.state.value as string) ?? ''} // Fix: Handle nullable/optional strings
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder='VD: Công ty Nike'
                className='w-full p-2 border rounded-md'
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Nút gửi */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button
            type='submit'
            disabled={!canSubmit || (isSubmitting as boolean)}
            className='w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity'
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm & Tạo mã SP'}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
