import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '@/services/orders';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60,
  });
};
