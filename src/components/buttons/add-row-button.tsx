import { cn } from "@/lib/utils";
import { PlusCircleIcon } from "lucide-react";

export default function AddRowButton({
  className,
  isEdit,
  addNewRow,
  disabled = true,
  size = 21,
}: {
  className?: string;
  isEdit: boolean;
  addNewRow: () => void;
  disabled?: boolean;
  size?: number;
}) {
  return (
    <button
      type="button"
      onClick={() => addNewRow()}
      className={cn(className, "cursor-pointer hover:text-black")}
      disabled={disabled}
    >
      <PlusCircleIcon
        size={size}
        className={cn("text-bl", isEdit ? "text-rd" : "opacity-50")}
        strokeWidth={1.5}
      />
    </button>
  );
}
