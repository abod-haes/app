import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { UserForm } from "./UserForm";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/queries";
import { User, CreateUserDto, UpdateUserDto } from "@/types/api/users";

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data } = useUsers({
    page,
    pageSize,
    includeRoles: true,
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const handleCreate = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (formData: CreateUserDto | UpdateUserDto) => {
    if (selectedUser) {
      // Update
      updateMutation.mutate(
        { id: selectedUser.id, data: formData as UpdateUserDto },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedUser(null);
          },
        }
      );
    } else {
      // Create
      createMutation.mutate(formData as CreateUserDto, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedUser(null);
        },
      });
    }
  };

  const columns = [
    {
      header: "الاسم",
      accessor: (row: User) => (
        <div>
          <div className="font-medium">
            {row.firstName} {row.lastName}
          </div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      ),
    },
    {
      header: "رقم الهاتف",
      accessor: "phoneNumber" as keyof User,
      cell: (value: string) => (
        <span className="font-mono text-sm" dir="ltr">
          {value}
        </span>
      ),
    },
    {
      header: "الأدوار",
      accessor: (row: User) => (
        <div className="flex flex-wrap gap-1">
          {row.roles.length === 0 ? (
            <Badge variant="outline" className="text-xs">
              لا يوجد
            </Badge>
          ) : (
            row.roles.map((role) => (
              <Badge key={role.id} variant="secondary" className="text-xs">
                {role.name}
              </Badge>
            ))
          )}
        </div>
      ),
    },
    {
      header: "حالة الهاتف",
      accessor: "phoneNumberVerified" as keyof User,
      cell: (value: boolean) => (
        <Badge variant={value ? "default" : "outline"}>
          {value ? "مؤكد" : "غير مؤكد"}
        </Badge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row: User) => (
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
        title="المستخدمين"
        description="إدارة المستخدمين وصلاحياتهم"
        action={{
          label: "إضافة مستخدم",
          onClick: handleCreate,
        }}
      />

      <DataTable
        data={data?.items || []}
        columns={columns}
        emptyMessage="لا يوجد مستخدمين متاحين"
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

      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        user={selectedUser || undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="حذف المستخدم"
        description={`هل أنت متأكد من حذف المستخدم "${selectedUser?.firstName} ${selectedUser?.lastName}"؟`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
