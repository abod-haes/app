import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/shared/Pagination";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { CategoryForm } from "./CategoryForm";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/queries";
import { Category } from "@/types/api/categories";
import { CreateCategoryDto, UpdateCategoryDto } from "@/types/api/categories";
import { getImageUrl } from "@/api/client";

export function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const { data, isLoading, isError, error } = useCategories({
    page,
    pageSize,
    includeProducts: false,
  });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleCreate = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (
    formData: CreateCategoryDto | UpdateCategoryDto
  ) => {
    if (selectedCategory) {
      // Update
      updateMutation.mutate(
        { id: selectedCategory.id, data: formData as UpdateCategoryDto },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedCategory(null);
          },
        }
      );
    } else {
      // Create
      createMutation.mutate(formData as CreateCategoryDto, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedCategory(null);
        },
      });
    }
  };

  const columns = [
    {
      header: "الصورة",
      accessor: (row: Category) => (
        <div className="h-12 w-12 rounded-lg overflow-hidden border">
          {row.imagePath ? (
            <img
              src={getImageUrl(row.imagePath)}
              alt={row.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
              لا صورة
            </div>
          )}
        </div>
      ),
    },
    {
      header: "الاسم",
      accessor: "name" as keyof Category,
    },
    {
      header: "الوصف",
      accessor: "description" as keyof Category,
      cell: (value: string) => (
        <span className="text-sm text-muted-foreground line-clamp-2">
          {value || "—"}
        </span>
      ),
    },
    {
      header: "عدد المنتجات",
      accessor: (row: Category) => (
        <Badge variant="outline">{row.products?.length || 0} منتج</Badge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row: Category) => (
        <ActionButtons
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row)}
          disabled={
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending
          }
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div>
        <PageHeader title="الفئات" description="إدارة فئات المنتجات" />
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">جاري تحميل البيانات...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PageHeader title="الفئات" description="إدارة فئات المنتجات" />
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-destructive">حدث خطأ أثناء تحميل البيانات</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : "خطأ غير معروف"}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = data?.items || [];
  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  return (
    <div>
      <PageHeader
        title="الفئات"
        description="إدارة فئات المنتجات"
        action={{
          label: "إضافة فئة",
          onClick: handleCreate,
        }}
      />
      <DataTable data={categories} columns={columns} />

      {data && data.totalCount > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={data.totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}

      {/* Create/Edit Form */}
      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        category={selectedCategory || undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        itemName={selectedCategory?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
