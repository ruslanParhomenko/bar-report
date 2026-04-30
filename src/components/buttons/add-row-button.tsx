import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function AddRowButton({
  className,
  isEdit,
  addNewRow,
  size = 18,
}: {
  className?: string;
  isEdit: boolean;
  addNewRow: () => void;
  size?: number;
}) {
  return (
    <button
      type="button"
      onClick={() => addNewRow()}
      className={cn(
        className,
        "flex cursor-pointer items-center justify-center hover:text-black",
      )}
    >
      <Plus
        size={size}
        className={cn("text-bl", isEdit ? "text-rd" : "opacity-50")}
        strokeWidth={1.5}
      />
    </button>
  );
}
