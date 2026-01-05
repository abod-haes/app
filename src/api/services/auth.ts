import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { LoginRequest, LoginResponse } from '@/types/api/auth';

export const authApi = {
  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },
};

