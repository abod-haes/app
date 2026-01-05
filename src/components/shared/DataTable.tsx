import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
                  {data.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      {columns.map((column) => (
                        <TableCell key={String(column.header)}>
                          {getCellContent(column, row)}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {data.map((row, rowIndex) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: rowIndex * 0.1,
              ease: [0.4, 0, 0.2, 1]
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                  {columns.map((column, index) => (
                    <motion.div
                      key={String(column.header)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: rowIndex * 0.1 + index * 0.05 
                      }}
                      className={cn(
                        "flex flex-col",
                        index !== columns.length - 1 && "pb-3 border-b border-border/50"
                      )}
                    >
                      <span className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                      {column.header}
                    </span>
                      <div className="text-sm font-medium text-foreground">
                        {getCellContent(column, row)}
                  </div>
                    </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}
