import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { CategoriesParams, CreateCategoryDto, UpdateCategoryDto } from '@/types/api/categories';
import { Category, CategoriesResponse } from '@/types/api/categories';

export const categoriesApi = {
  /**
   * Get all categories with pagination and optional products
   */
  getAll: async (params: CategoriesParams = {}): Promise<CategoriesResponse> => {
    const { page = 1, pageSize = 20, includeProducts = false } = params;
    const response = await apiClient.get<CategoriesResponse>(API_ENDPOINTS.CATEGORIES, {
      params: {
        page,
        pageSize,
        includeProducts,
      },
    });
    return response.data;
  },

  /**
   * Get category by ID
   */
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
    return response.data;
  },

  /**
   * Create a new category (multipart/form-data)
   */
  create: async (data: CreateCategoryDto): Promise<Category> => {
    const formData = new FormData();
    formData.append('name', data.name);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.image) {
      formData.append('Image', data.image);
    }
    
    if (data.productIds && data.productIds.length > 0) {
      data.productIds.forEach((productId) => {
        formData.append('ProductIds', productId);
      });
    }

    const response = await apiClient.post<Category>(API_ENDPOINTS.CATEGORIES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update category (multipart/form-data)
   */
  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    const formData = new FormData();
    
    if (data.name) {
      formData.append('name', data.name);
    }
    
    if (data.description !== undefined) {
      formData.append('description', data.description);
    }
    
    if (data.image) {
      formData.append('Image', data.image);
    }
    
    if (data.productIds && data.productIds.length > 0) {
      data.productIds.forEach((productId) => {
        formData.append('ProductIds', productId);
      });
    }

    const response = await apiClient.put<Category>(`${API_ENDPOINTS.CATEGORIES}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete category
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  },
};

