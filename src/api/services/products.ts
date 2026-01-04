import apiClient from "../client";
import { API_ENDPOINTS } from "../endpoints";
import {
  ProductsParams,
  CreateProductDto,
  UpdateProductDto,
  Product,
  ProductsResponse,
  ProductImage,
} from "@/types/api/products";

export const productsApi = {
  /**
   * Get all products with pagination and optional categories
   */
  getAll: async (params: ProductsParams = {}): Promise<ProductsResponse> => {
    const {
      page = 1,
      pageSize = 20,
      includeCategories = true,
      categoryIds,
    } = params;
    const requestParams: Record<string, any> = {
      page,
      pageSize,
      includeCategories,
    };

    // Add categoryIds if provided
    if (categoryIds && categoryIds.length > 0) {
      requestParams.categoryIds = categoryIds;
    }

    const response = await apiClient.get<ProductsResponse>(
      API_ENDPOINTS.PRODUCTS,
      {
        // params: requestParams,
      }
    );
    return response.data;
  },

  /**
   * Get product by ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(
      `${API_ENDPOINTS.PRODUCTS}/${id}`
    );
    return response.data;
  },

  /**
   * Create a new product (multipart/form-data)
   */
  create: async (data: CreateProductDto): Promise<Product> => {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Price", data.price.toString());

    if (data.description) {
      formData.append("Description", data.description);
    }

    if (data.image) {
      formData.append("Image", data.image);
    }

    if (data.categoryIds && data.categoryIds.length > 0) {
      data.categoryIds.forEach((categoryId) => {
        formData.append("CategoryIds", categoryId);
      });
    }

    const response = await apiClient.post<Product>(
      API_ENDPOINTS.PRODUCTS,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Update product (application/json)
   */
  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await apiClient.put<Product>(
      `${API_ENDPOINTS.PRODUCTS}/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete product
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  },

  /**
   * Add image to product (multipart/form-data)
   */
  addImage: async (id: string, image: File): Promise<ProductImage> => {
    const formData = new FormData();
    formData.append("Image", image);

    const response = await apiClient.post<ProductImage>(
      `${API_ENDPOINTS.PRODUCTS}/${id}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Delete product image
   */
  deleteImage: async (id: string, imageId: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.PRODUCTS}/${id}/images/${imageId}`);
  },

  /**
   * Set image as main
   */
  setMainImage: async (id: string, imageId: string): Promise<void> => {
    await apiClient.put(
      `${API_ENDPOINTS.PRODUCTS}/${id}/images/${imageId}/set-main`
    );
  },
};
