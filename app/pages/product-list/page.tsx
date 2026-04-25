'use client';
import { useProducts } from '@/hooks/useProducts';
import { ProductListTable } from '@/components/product/ListAllProduct';
import { Loader2, AlertCircle, Package } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataImportButton } from '@/components/import-from-csv-button';

// Import your main navigation or page component
export default function InventoryPage() {
  const { data: products, isLoading, isError, error } = useProducts();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Prevents unnecessary background refetches in dev
        refetchOnWindowFocus: false,
        // How many times to retry a failed Supabase query
        retry: 1,
      },
    },
  });
  if (isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className='flex flex-col items-center justify-center h-64 gap-3'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
          <p className='text-slate-500 font-medium'>Loading inventory...</p>
        </div>
      </QueryClientProvider>
    );
  }

  if (isError) {
    return (
      <div className='p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700'>
        <AlertCircle className='w-5 h-5' />
        <p>
          Error: {error instanceof Error ? error.message : 'Failed to load'}
        </p>
      </div>
    );
  }

  return (
    <div className='p-4 md:p-8 max-w-7xl mx-auto space-y-6'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-emerald-500/10 rounded-lg'>
            <Package className='text-emerald-500' size={24} />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>Kho hàng</h1>
            <p className='text-sm text-slate-500'>Quản lý danh mục sản phẩm và tồn kho</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <DataImportButton />
          <div className='bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl'>
            <p className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
              Tổng cộng: <span className='text-emerald-500'>{products?.length || 0}</span> sản phẩm
            </p>
          </div>
        </div>
      </div>

      {/* Our TanStack Table Component */}
      <ProductListTable data={products || []} />
    </div>
  );
}
