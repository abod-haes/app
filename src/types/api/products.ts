import { PaginationResponse } from './common';

export interface ProductImage {
  id: string;
  imagePath: string;
  isMain: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: ProductImage[];
  categories: ProductCategory[];
}

export type ProductsResponse = PaginationResponse<Product>;

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  image?: File;
  categoryIds?: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  categoryIds?: string[];
}

export interface ProductsParams {
  page?: number;
  pageSize?: number;
  includeCategories?: boolean;
  categoryIds?: string[];
}

