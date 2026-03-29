'use client';
import { useProducts } from '@/hooks/useProducts';
import { ProductListTable } from '@/components/product/ListAllProduct';
import { Loader2, AlertCircle } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Inventory</h1>
        <p className='text-sm text-slate-500'>
          {products?.length || 0} Products total
        </p>
      </div>

      {/* Our TanStack Table Component */}
      <ProductListTable data={products || []} />
    </div>
  );
}
