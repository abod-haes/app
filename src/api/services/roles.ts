import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { RolesParams, CreateRoleDto, UpdateRoleDto, Role, RolesResponse } from '@/types/api/roles';

export const rolesApi = {
  /**
   * Get all roles with pagination
   */
  getAll: async (params: RolesParams = {}): Promise<RolesResponse> => {
    const { page = 1, pageSize = 20 } = params;
    const response = await apiClient.get<RolesResponse>(API_ENDPOINTS.ROLES, {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  },

  /**
   * Get role by ID
   */
  getById: async (id: string): Promise<Role> => {
    const response = await apiClient.get<Role>(`${API_ENDPOINTS.ROLES}/${id}`);
    return response.data;
  },

  /**
   * Create a new role
   */
  create: async (data: CreateRoleDto): Promise<Role> => {
    const response = await apiClient.post<Role>(API_ENDPOINTS.ROLES, data);
    return response.data;
  },

  /**
   * Update role
   */
  update: async (id: string, data: UpdateRoleDto): Promise<Role> => {
    const response = await apiClient.put<Role>(`${API_ENDPOINTS.ROLES}/${id}`, data);
    return response.data;
  },

  /**
   * Delete role
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.ROLES}/${id}`);
  },

  /**
   * Assign role to user
   */
  assignToUser: async (userId: string, roleId: string): Promise<void> => {
    await apiClient.post(`${API_ENDPOINTS.ROLES}/users/${userId}/assign/${roleId}`);
  },

  /**
   * Remove role from user
   */
  removeFromUser: async (userId: string, roleId: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.ROLES}/users/${userId}/remove/${roleId}`);
  },
};

