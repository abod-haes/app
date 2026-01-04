import { PaginationResponse } from './common';

export interface CategoryProduct {
  id: string;
  name: string;
  price: number;
  mainImagePath: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  products: CategoryProduct[];
}

export type CategoriesResponse = PaginationResponse<Category>;

export interface CreateCategoryDto {
  name: string;
  description?: string;
  image?: File;
  productIds?: string[];
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  image?: File;
  productIds?: string[];
}

export interface CategoriesParams {
  page?: number;
  pageSize?: number;
  includeProducts?: boolean;
}

