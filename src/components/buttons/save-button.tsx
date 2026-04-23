import { cn } from "@/lib/utils";
import { SaveIcon } from "lucide-react";

export default function SaveButton({
  className,
  isEdit,
  disabled = true,
  size = 21,
}: {
  className?: string;
  isEdit: boolean;
  disabled?: boolean;
  size?: number;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(className, "cursor-pointer")}
    >
      <SaveIcon
        size={size}
        className={cn("text-bl", isEdit ? "text-rd" : "opacity-50")}
        strokeWidth={1.5}
      />
    </button>
  );
}
