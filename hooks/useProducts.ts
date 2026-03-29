import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/products';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    // Optional: Refresh data when user switches back to the app
    refetchOnWindowFocus: true,
    // Optional: Keep the data fresh for 1 minute
    staleTime: 1000 * 60,
  });
};
