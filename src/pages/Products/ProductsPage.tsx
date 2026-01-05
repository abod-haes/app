import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/shared/Pagination";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { ProductForm } from "./ProductForm";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/queries";
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from "@/types/api/products";
import { getImageUrl } from "@/api/client";

export function ProductsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data, isLoading, isError, error } = useProducts({
    page,
    pageSize,
    includeCategories: true,
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (formData: CreateProductDto | UpdateProductDto) => {
    if (selectedProduct) {
      // Update
      updateMutation.mutate(
        { id: selectedProduct.id, data: formData as UpdateProductDto },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedProduct(null);
          },
        }
      );
    } else {
      // Create
      createMutation.mutate(formData as CreateProductDto, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedProduct(null);
        },
      });
    }
  };

  const columns = [
    {
      header: "الصورة",
      accessor: (row: Product) => {
        const mainImage = row.images.find((img) => img.isMain) || row.images[0];
        return (
          <div className="h-12 w-12 rounded-lg overflow-hidden border">
            {mainImage ? (
              <img
                src={getImageUrl(mainImage.imagePath)}
                alt={row.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                لا صورة
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "الاسم",
      accessor: "name" as keyof Product,
    },
    {
      header: "السعر",
      accessor: "price" as keyof Product,
      cell: (value: number) => (
        <span className="font-medium">${value.toFixed(2)}</span>
      ),
    },
    {
      header: "الفئات",
      accessor: (row: Product) => (
        <div className="flex flex-wrap gap-1">
          {row.categories.length > 0 ? (
            row.categories.slice(0, 2).map((category) => (
              <Badge key={category.id} variant="outline" className="text-xs">
                {category.name}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
          {row.categories.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{row.categories.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: "عدد الصور",
      accessor: (row: Product) => (
        <Badge variant="outline">{row.images?.length || 0}</Badge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row: Product) => (
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
        <PageHeader title="المنتجات" description="إدارة مخزون المنتجات" />
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
        <PageHeader title="المنتجات" description="إدارة مخزون المنتجات" />
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

  const products = data?.items || [];
  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  return (
    <div>
      <PageHeader
        title="المنتجات"
        description="إدارة مخزون المنتجات"
        action={{
          label: "إضافة منتج",
          onClick: handleCreate,
        }}
      />
      <DataTable data={products} columns={columns} />

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
      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        product={selectedProduct || undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        itemName={selectedProduct?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
