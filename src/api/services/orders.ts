import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { PaginationParams } from '@/types/api/common';
import { Order, OrdersResponse } from '@/types/api/orders';

export const ordersApi = {
  /**
   * Get all orders with pagination
   */
  getAll: async (params: PaginationParams = {}): Promise<OrdersResponse> => {
    const { page = 1, pageSize = 20 } = params;
    const response = await apiClient.get<OrdersResponse>(API_ENDPOINTS.ORDERS, {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  },

  /**
   * Get order by ID
   */
  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${id}`);
    return response.data;
  },
};

