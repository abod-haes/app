import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Package, ShoppingCart } from "lucide-react";
import { useProducts, useOrders } from "@/hooks/queries";
import { mockUsers, mockRoles } from "@/utils/mockData";

export function DashboardPage() {
  const { data: productsData, isLoading: productsLoading } = useProducts({
    page: 1,
    pageSize: 1, // نحتاج فقط totalCount
    includeCategories: false,
  });

  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    page: 1,
    pageSize: 1, // نحتاج فقط totalCount
  });

  const stats = [
    {
      title: "إجمالي المستخدمين",
      value: mockUsers.length,
      icon: Users,
      description: "المستخدمين النشطين في النظام",
      isLoading: false,
    },
    {
      title: "الأدوار",
      value: mockRoles.length,
      icon: Shield,
      description: "الأدوار المعرفة",
      isLoading: false,
    },
    {
      title: "المنتجات",
      value: productsData?.totalCount || 0,
      icon: Package,
      description: "المنتجات في المخزون",
      isLoading: productsLoading,
    },
    {
      title: "الطلبات",
      value: ordersData?.totalCount || 0,
      icon: ShoppingCart,
      description: "إجمالي الطلبات",
      isLoading: ordersLoading,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">لوحة التحكم</h2>
        <p className="text-muted-foreground mt-1">
          مرحباً بك في لوحة التحكم الإدارية
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.isLoading ? "..." : stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
