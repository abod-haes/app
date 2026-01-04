import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { mockUsers } from "@/utils/mockData";
import { User } from "@/types";

export function UsersPage() {
  const columns = [
    {
      header: "الاسم",
      accessor: "name" as keyof User,
    },
    {
      header: "البريد الإلكتروني",
      accessor: "email" as keyof User,
    },
    {
      header: "الدور",
      accessor: "role" as keyof User,
    },
    {
      header: "الحالة",
      accessor: "status" as keyof User,
      cell: (value: string) => (
        <Badge variant={value === "active" ? "success" : "secondary"}>
          {value === "active" ? "نشط" : "غير نشط"}
        </Badge>
      ),
    },
    {
      header: "تاريخ الإنشاء",
      accessor: "createdAt" as keyof User,
    },
  ];

  return (
    <div>
      <PageHeader
        title="المستخدمين"
        description="إدارة المستخدمين وصلاحياتهم"
        action={{
          label: "إضافة مستخدم",
          onClick: () => console.log("Add user clicked"),
        }}
      />
      <DataTable data={mockUsers} columns={columns} />
    </div>
  );
}
