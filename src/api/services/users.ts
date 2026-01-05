import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { UsersParams, CreateUserDto, UpdateUserDto, User, UsersResponse } from '@/types/api/users';

export const usersApi = {
  /**
   * Get all users with pagination
   */
  getAll: async (params: UsersParams = {}): Promise<UsersResponse> => {
    const { page = 1, pageSize = 20, includeRoles = true } = params;
    const response = await apiClient.get<UsersResponse>(API_ENDPOINTS.USERS, {
      params: {
        page,
        pageSize,
        includeRoles,
      },
    });
    return response.data;
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`${API_ENDPOINTS.USERS}/${id}`);
    return response.data;
  },

  /**
   * Create a new user
   */
  create: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post<User>(API_ENDPOINTS.USERS, data);
    return response.data;
  },

  /**
   * Update user
   */
  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.put<User>(`${API_ENDPOINTS.USERS}/${id}`, data);
    return response.data;
  },

  /**
   * Patch user (partial update)
   */
  patch: async (id: string, data: Partial<UpdateUserDto>): Promise<User> => {
    const response = await apiClient.patch<User>(`${API_ENDPOINTS.USERS}/${id}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.USERS}/${id}`);
  },
};

