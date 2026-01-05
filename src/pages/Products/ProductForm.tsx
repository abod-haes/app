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
import { MultipleSelect, SelectOption } from "@/components/ui/select";
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from "@/types/api/products";
import { useCategories } from "@/hooks/queries";
import { getImageUrl } from "@/api/client";
import { Upload, X } from "lucide-react";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => void;
  product?: Product;
  isLoading?: boolean;
}

export function ProductForm({
  open,
  onOpenChange,
  onSubmit,
  product,
  isLoading = false,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: categoriesData } = useCategories({
    pageSize: 100,
    includeProducts: false,
  });
  const categories = categoriesData?.items || [];

  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price);
      setSelectedCategories(product.categories.map((c) => c.id));

      const mainImage = product.images.find((img) => img.isMain);
      setImagePreview(
        mainImage?.imagePath || product.images[0]?.imagePath || null
      );
      setImage(null);
      setImageError(false);
    } else {
      setName("");
      setDescription("");
      setPrice(0);
      setImage(null);
      setImagePreview(null);
      setImageError(false);
      setSelectedCategories([]);
    }
  }, [product, open]);

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

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
  };

  const categoryOptions: SelectOption[] = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || price <= 0) {
      return;
    }

    if (isEdit) {
      // Update - JSON only, no image
      const formData: UpdateProductDto = {
        name: name.trim(),
        description: description.trim() || undefined,
        price,
        categoryIds:
          selectedCategories.length > 0 ? selectedCategories : undefined,
      };
      onSubmit(formData);
    } else {
      // Create - multipart/form-data with image
      const formData: CreateProductDto = {
        name: name.trim(),
        description: description.trim() || undefined,
        price,
        ...(image && { image }),
        categoryIds:
          selectedCategories.length > 0 ? selectedCategories : undefined,
      };
      onSubmit(formData);
    }
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
              {isEdit ? "تعديل المنتج" : "إضافة منتج جديد"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "قم بتعديل معلومات المنتج"
                : "أدخل معلومات المنتج الجديد"}
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
                placeholder="أدخل اسم المنتج"
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
                placeholder="أدخل وصف المنتج (اختياري)"
                rows={4}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">
                السعر <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">الصورة الرئيسية</Label>
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

            <div className="grid gap-2">
              <Label htmlFor="categories">الفئات</Label>
              <MultipleSelect
                id="categories"
                options={categoryOptions}
                placeholder="اختر الفئات"
                value={selectedCategories}
                onValueChange={handleCategoryChange}
              />
              {selectedCategories.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  تم اختيار {selectedCategories.length}{" "}
                  {selectedCategories.length === 1 ? "فئة" : "فئات"}
                </p>
              )}
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
            <Button
              type="submit"
              disabled={isLoading || !name.trim() || price <= 0}
            >
              {isLoading ? "جاري الحفظ..." : isEdit ? "حفظ التغييرات" : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
