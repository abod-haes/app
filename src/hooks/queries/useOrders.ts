import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/services/orders';
import { PaginationParams } from '@/types/api/common';
import { Order } from '@/types/api/orders';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

/**
 * Hook to fetch orders list with pagination
 */
export function useOrders(params: PaginationParams = {}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.getAll(params),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 60000, // 1 minute
  });
}

