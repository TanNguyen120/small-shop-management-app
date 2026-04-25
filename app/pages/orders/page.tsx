'use client';

import { useOrders } from '@/hooks/useOrders';
import { OrderListTable } from '@/components/order/OrderListTable';
import { Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function OrdersPage() {
  const { data: orders, isLoading, isError, error } = useOrders();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-64 gap-3'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
        <p className='text-slate-500 font-medium'>Đang tải danh sách đơn hàng...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700'>
        <AlertCircle className='w-5 h-5' />
        <p>
          Lỗi: {error instanceof Error ? error.message : 'Không thể tải đơn hàng'}
        </p>
      </div>
    );
  }

  return (
    <div className='p-4 md:p-8 max-w-7xl mx-auto space-y-6'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <ShoppingBag className='text-primary' size={24} />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>Lịch sử đơn hàng</h1>
            <p className='text-sm text-slate-500'>Quản lý các giao dịch từ POS</p>
          </div>
        </div>
        <div className='bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl'>
          <p className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
            Tổng cộng: <span className='text-primary'>{orders?.length || 0}</span> đơn hàng
          </p>
        </div>
      </div>

      <OrderListTable data={orders || []} />
    </div>
  );
}
