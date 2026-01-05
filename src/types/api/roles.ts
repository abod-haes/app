import { PaginationResponse } from './common';

export interface Role {
  id: string;
  name: string;
}

export interface RolesResponse extends PaginationResponse<Role> {}

export interface CreateRoleDto {
  name: string;
}

export interface UpdateRoleDto {
  name: string;
}

export interface RolesParams {
  page?: number;
  pageSize?: number;
}

