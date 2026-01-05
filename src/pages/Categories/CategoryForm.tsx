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
import { Textarea } from "@/components/ui/textarea";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/api/categories";
import { getImageUrl } from "@/api/client";
import { Upload, X } from "lucide-react";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateCategoryDto | UpdateCategoryDto) => void;
  category?: Category;
  isLoading?: boolean;
}

export function CategoryForm({
  open,
  onOpenChange,
  onSubmit,
  category,
  isLoading = false,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const isEdit = !!category;

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
      setImagePreview(category.imagePath || null);
      setImage(null);
      setImageError(false);
    } else {
      setName("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      setImageError(false);
    }
  }, [category, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageError(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.onerror = () => {
        setImageError(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const formData: CreateCategoryDto | UpdateCategoryDto = {
      name: name.trim(),
      description: description.trim() || undefined,
      ...(image && { image }),
    };

    onSubmit(formData);
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "تعديل الفئة" : "إضافة فئة جديدة"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "قم بتعديل معلومات الفئة"
                : "أدخل معلومات الفئة الجديدة"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                الاسم <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسم الفئة"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="أدخل وصف الفئة (اختياري)"
                rows={4}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">الصورة</Label>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer hover:bg-accent hover:border-primary transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      اضغط لاختيار صورة أو اسحبها هنا
                    </span>
                  </Label>
                </div>
                {imagePreview && (
                  <div className="relative inline-block">
                    <div className="relative">
                      {imageError ? (
                        <div className="h-32 w-32 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg border text-xs text-center p-2">
                          <span className="text-muted-foreground mb-1">
                            {image?.name || "صورة"}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            فشل تحميل الصورة
                          </span>
                        </div>
                      ) : (
                        <img
                          src={
                            imagePreview.startsWith("data:")
                              ? imagePreview
                              : getImageUrl(imagePreview)
                          }
                          alt={image?.name || "Preview"}
                          className="h-32 w-32 object-cover rounded-lg border"
                          onError={() => {
                            setImageError(true);
                          }}
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                        setImageError(false);
                        const input = document.getElementById(
                          "image"
                        ) as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "جاري الحفظ..." : isEdit ? "حفظ التغييرات" : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
