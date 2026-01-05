import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Role, CreateRoleDto, UpdateRoleDto } from "@/types/api/roles";

interface RoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRoleDto | UpdateRoleDto) => void;
  role?: Role;
  isLoading?: boolean;
}

export function RoleForm({
  open,
  onOpenChange,
  onSubmit,
  role,
  isLoading = false,
}: RoleFormProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (role) {
      setName(role.name);
    } else {
      setName("");
    }
  }, [role, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{role ? "تعديل الدور" : "إضافة دور جديد"}</DialogTitle>
            <DialogDescription>
              {role
                ? "قم بتعديل معلومات الدور"
                : "أدخل معلومات الدور الجديد"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">اسم الدور</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: Admin"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : role ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

