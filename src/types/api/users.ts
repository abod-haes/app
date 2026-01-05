import { PaginationResponse } from './common';

export interface UserRole {
  id: string;
  name: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location?: string;
  latitude: number;
  longitude: number;
  phoneNumberVerified: boolean;
  phoneNumberVerifiedAt: string | null;
  roles: UserRole[];
}

export interface UsersResponse extends PaginationResponse<User> {}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  phoneNumberVerified?: boolean;
  roleIds?: string[];
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  phoneNumberVerified?: boolean;
  roleIds?: string[];
}

export interface UsersParams {
  page?: number;
  pageSize?: number;
  includeRoles?: boolean;
}

