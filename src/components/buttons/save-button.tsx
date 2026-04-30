import { cn } from "@/lib/utils";
import { SaveIcon } from "lucide-react";

export default function SaveButton({
  formId,
  className,
  isEdit,
  disabled = true,
  size = 18,
}: {
  formId: string;
  className?: string;
  isEdit: boolean;
  disabled?: boolean;
  size?: number;
}) {
  return (
    <button
      form={formId}
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
