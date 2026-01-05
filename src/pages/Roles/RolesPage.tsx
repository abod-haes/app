import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { RoleForm } from "./RoleForm";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/hooks/queries";
import { Role, CreateRoleDto, UpdateRoleDto } from "@/types/api/roles";

export function RolesPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const { data } = useRoles({
    page,
    pageSize,
  });

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const handleCreate = () => {
    setSelectedRole(null);
    setFormOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (formData: CreateRoleDto | UpdateRoleDto) => {
    if (selectedRole) {
      // Update
      updateMutation.mutate(
        { id: selectedRole.id, data: formData as UpdateRoleDto },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedRole(null);
          },
        }
      );
    } else {
      // Create
      createMutation.mutate(formData as CreateRoleDto, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedRole) {
      deleteMutation.mutate(selectedRole.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedRole(null);
        },
      });
    }
  };

  const columns = [
    {
      header: "الاسم",
      accessor: "name" as keyof Role,
    },
    {
      header: "الإجراءات",
      accessor: (row: Role) => (
        <ActionButtons
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="الأدوار"
        description="إدارة أدوار المستخدمين والصلاحيات"
        action={{
          label: "إضافة دور",
          onClick: handleCreate,
        }}
      />

      <DataTable
        data={data?.items || []}
        columns={columns}
        emptyMessage="لا توجد أدوار متاحة"
      />

      {data && data.totalCount > pageSize && (
        <Pagination
          page={page}
          totalPages={Math.ceil(data.totalCount / pageSize)}
          totalCount={data.totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
      />
      )}

      <RoleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        role={selectedRole || undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="حذف الدور"
        description={`هل أنت متأكد من حذف الدور "${selectedRole?.name}"؟`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
