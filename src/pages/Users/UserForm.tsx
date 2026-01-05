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
import { MultipleSelect, SelectOption } from "@/components/ui/select";
import { User, CreateUserDto, UpdateUserDto } from "@/types/api/users";
import { useRoles } from "@/hooks/queries";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => void;
  user?: User;
  isLoading?: boolean;
}

export function UserForm({
  open,
  onOpenChange,
  onSubmit,
  user,
  isLoading = false,
}: UserFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const { data: rolesData } = useRoles({ pageSize: 100 });
  const roles = rolesData?.items || [];

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber);
      setLocation(user.location || "");
      setSelectedRoles(user.roles.map((r) => r.id));
      setPassword(""); // Don't prefill password
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setLocation("");
      setSelectedRoles([]);
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: CreateUserDto | UpdateUserDto = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
      ...(email.trim() && { email: email.trim() }),
      ...(password && { password }),
      ...(location && { location }),
      ...(selectedRoles.length > 0 && { roleIds: selectedRoles }),
    };
    onSubmit(formData);
  };

  const handleRoleChange = (values: string[]) => {
    setSelectedRoles(values);
  };

  const roleOptions: SelectOption[] = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {user ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
            </DialogTitle>
            <DialogDescription>
              {user
                ? "قم بتعديل معلومات المستخدم"
                : "أدخل معلومات المستخدم الجديد"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">اسم العائلة</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">
                  البريد الإلكتروني{" "}
                  <span className="text-xs text-muted-foreground">
                    (اختياري)
                  </span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">
                  رقم الهاتف <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+000000000"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">
                كلمة المرور {user && "(اتركه فارغاً للاحتفاظ بالكلمة الحالية)"}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!user}
                minLength={6}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">الموقع</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="اختياري"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="roles">الأدوار</Label>
              <MultipleSelect
                id="roles"
                options={roleOptions}
                placeholder="اختر الأدوار"
                value={selectedRoles}
                onValueChange={handleRoleChange}
              />
              {selectedRoles.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  تم اختيار {selectedRoles.length}{" "}
                  {selectedRoles.length === 1 ? "دور" : "أدوار"}
                </p>
              )}
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
              {isLoading ? "جاري الحفظ..." : user ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
