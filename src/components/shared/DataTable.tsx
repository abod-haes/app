import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  cell?: (value: any, row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  emptyMessage = "لا توجد بيانات متاحة",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  const getCellContent = (column: Column<T>, row: T): ReactNode => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    } else {
      const value = row[column.accessor];
      return column.cell ? column.cell(value, row) : String(value ?? "");
    }
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={String(column.header)}>
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((column) => (
                        <TableCell key={String(column.header)}>
                          {getCellContent(column, row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((row) => (
          <Card key={row.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {columns.map((column) => (
                  <div key={String(column.header)} className="flex flex-col">
                    <span className="text-xs font-medium text-muted-foreground mb-1">
                      {column.header}
                    </span>
                    <div className="text-sm">{getCellContent(column, row)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
