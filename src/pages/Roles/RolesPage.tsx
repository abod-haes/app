import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { mockRoles } from "@/utils/mockData";
import { Role } from "@/types";

export function RolesPage() {
  const columns = [
    {
      header: "الاسم",
      accessor: "name" as keyof Role,
    },
    {
      header: "الوصف",
      accessor: "description" as keyof Role,
    },
    {
      header: "الصلاحيات",
      accessor: "permissions" as keyof Role,
      cell: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((perm, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {perm}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2} المزيد
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: "المستخدمين",
      accessor: "userCount" as keyof Role,
      cell: (value: number) => (
        <span className="font-medium">{value} مستخدم</span>
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
          onClick: () => console.log("Add role clicked"),
        }}
      />
      <DataTable data={mockRoles} columns={columns} />
    </div>
  );
}
