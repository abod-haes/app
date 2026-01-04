import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
  editLabel?: string;
  deleteLabel?: string;
}

export function ActionButtons({
  onEdit,
  onDelete,
  disabled = false,
  editLabel = "تعديل",
  deleteLabel = "حذف",
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        disabled={disabled}
        className="gap-2"
      >
        <Edit className="h-4 w-4" />
        <span className="hidden sm:inline">{editLabel}</span>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        disabled={disabled}
        className="gap-2"
      >
        <Trash2 className="h-4 w-4" />
        <span className="hidden sm:inline">{deleteLabel}</span>
      </Button>
    </div>
  );
}

