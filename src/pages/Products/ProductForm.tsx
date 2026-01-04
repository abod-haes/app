import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Product, CreateProductDto, UpdateProductDto } from "@/types/api/products";
import { useCategories } from "@/hooks/queries";
import { Card, CardContent } from "@/components/ui/card";

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: categoriesData } = useCategories({ pageSize: 100, includeProducts: false });
  const categories = categoriesData?.items || [];

  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price);
      setSelectedCategories(product.categories.map((c) => c.id));
      
      const mainImage = product.images.find((img) => img.isMain);
      setImagePreview(mainImage?.imagePath || product.images[0]?.imagePath || null);
      setImage(null);
    } else {
      setName("");
      setDescription("");
      setPrice(0);
      setImage(null);
      setImagePreview(null);
      setSelectedCategories([]);
    }
  }, [product, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
      };
      onSubmit(formData);
    } else {
      // Create - multipart/form-data with image
      const formData: CreateProductDto = {
        name: name.trim(),
        description: description.trim() || undefined,
        price,
        ...(image && { image }),
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
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
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>{isEdit ? "تعديل المنتج" : "إضافة منتج جديد"}</SheetTitle>
            <SheetDescription>
              {isEdit
                ? "قم بتعديل معلومات المنتج"
                : "أدخل معلومات المنتج الجديد"}
            </SheetDescription>
          </SheetHeader>

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
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>الفئات</Label>
              <Card>
                <CardContent className="p-4 max-h-48 overflow-y-auto">
                  {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      لا توجد فئات متاحة
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2 rtl:space-x-reverse"
                        >
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryToggle(category.id)}
                            disabled={isLoading}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim() || price <= 0}>
              {isLoading
                ? "جاري الحفظ..."
                : isEdit
                ? "حفظ التغييرات"
                : "إضافة"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

