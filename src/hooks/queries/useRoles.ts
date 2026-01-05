import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '@/api/services/roles';
import { RolesParams, CreateRoleDto, UpdateRoleDto } from '@/types/api/roles';

// Query keys
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params: RolesParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
};

/**
 * Hook to fetch roles list with pagination
 */
export function useRoles(params: RolesParams = {}) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => rolesApi.getAll(params),
    staleTime: 30000,
  });
}

/**
 * Hook to fetch a single role by ID
 */
export function useRole(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => rolesApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 60000,
  });
}

/**
 * Hook to create a new role
 */
export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleDto) => rolesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

/**
 * Hook to update a role
 */
export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleDto }) =>
      rolesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete a role
 */
export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

/**
 * Hook to assign role to user
 */
export function useAssignRoleToUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      rolesApi.assignToUser(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

/**
 * Hook to remove role from user
 */
export function useRemoveRoleFromUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      rolesApi.removeFromUser(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

