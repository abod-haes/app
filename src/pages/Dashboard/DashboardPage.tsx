import { motion } from "framer-motion";
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
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {stat.isLoading ? "..." : stat.value}
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
