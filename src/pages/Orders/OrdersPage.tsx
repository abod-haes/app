import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOrders } from "@/hooks/queries";
import { Order, OrderStatus, OrderStatusLabels } from "@/types/api/orders";
import { ChevronRight, ChevronLeft } from "lucide-react";

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const { data, isLoading, isError, error } = useOrders({ page, pageSize });

  const columns = [
    {
      header: "رقم الطلب",
      accessor: (row: Order) => (
        <span className="font-mono text-sm">{row.id.slice(0, 8)}...</span>
      ),
    },
    {
      header: "العميل",
      accessor: (row: Order) => (
        <div>
          <div className="font-medium">
            {row.userFirstName} {row.userLastName}
          </div>
          <div className="text-sm text-muted-foreground">
            {row.userPhoneNumber}
          </div>
        </div>
      ),
    },
    {
      header: "الإجمالي",
      accessor: "totalAmount" as keyof Order,
      cell: (value: number) => (
        <span className="font-medium">${value.toFixed(2)}</span>
      ),
    },
    {
      header: "عدد العناصر",
      accessor: (row: Order) => (
        <span className="font-medium">{row.items.length} عنصر</span>
      ),
    },
    {
      header: "الحالة",
      accessor: "status" as keyof Order,
      cell: (value: OrderStatus) => {
        const variants: Record<
          OrderStatus,
          "default" | "warning" | "success" | "destructive"
        > = {
          [OrderStatus.Pending]: "warning",
          [OrderStatus.Processing]: "default",
          [OrderStatus.Shipped]: "default",
          [OrderStatus.Delivered]: "success",
          [OrderStatus.Cancelled]: "destructive",
        };
        return (
          <Badge variant={variants[value] || "secondary"}>
            {OrderStatusLabels[value] || value}
          </Badge>
        );
      },
    },
    {
      header: "تاريخ الإنشاء",
      accessor: "createdAt" as keyof Order,
      cell: (value: string) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString("ar-SA")}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div>
        <PageHeader title="الطلبات" description="عرض وإدارة طلبات العملاء" />
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
        <PageHeader title="الطلبات" description="عرض وإدارة طلبات العملاء" />
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

  const orders = data?.items || [];
  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  return (
    <div>
      <PageHeader title="الطلبات" description="عرض وإدارة طلبات العملاء" />
      <DataTable data={orders} columns={columns} />

      {/* Pagination */}
      {data && data.totalCount > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            عرض {(page - 1) * pageSize + 1} -{" "}
            {Math.min(page * pageSize, data.totalCount)} من {data.totalCount}{" "}
            طلب
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <span className="text-sm">
              صفحة {page} من {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
