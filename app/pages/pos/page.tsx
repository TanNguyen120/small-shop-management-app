'use client';

import { Suspense } from 'react';
import CreateByBarcode from './createByBarcode';
import { OrderList } from './orderList';
import { ShoppingCart, Receipt } from 'lucide-react';
import { usePOSStore } from '@/store/use-pos-store';

export default function POSPage() {
  const { items } = usePOSStore();

  return (
    <main className='min-h-screen bg-[#0F172A] p-4 md:p-8'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8'>
        {/* Left Column: Input Area (Scanner) - 7 Columns */}
        <div className='lg:col-span-4 space-y-6'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 bg-emerald-500/10 rounded-lg'>
              <ShoppingCart className='text-emerald-500' size={24} />
            </div>
            <h1 className='text-2xl font-bold text-white'>Quầy Bán Hàng</h1>
          </div>

          <CreateByBarcode />

          {/* Quick tips for the shop owner */}
          <div className='bg-slate-800/30 border border-slate-800 rounded-2xl p-4 text-slate-400 text-sm'>
            <p>
              💡 **Mẹo:** Sử dụng máy quét để nhập hàng nhanh. Nhấn **F9** để
              thanh toán.
            </p>
          </div>
        </div>

        {/* Right Column: Active Order (Basket) - 5 Columns */}
        <div className='lg:col-span-8 flex flex-col h-full'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-2 bg-blue-500/10 rounded-lg'>
              <Receipt className='text-blue-500' size={24} />
            </div>
            <h2 className='text-2xl font-bold text-white'>Đơn hàng hiện tại</h2>
            <span className='ml-auto bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs'>
              {items.length} mặt hàng
            </span>
          </div>

          <div className='flex-1 bg-[#1E293B] border border-slate-800 rounded-[32px] overflow-hidden flex flex-col'>
            <Suspense
              fallback={
                <div className='p-8 text-white'>Đang tải giỏ hàng...</div>
              }
            >
              <OrderList />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
