import { cn } from "@/lib/utils";
import { SaveIcon } from "lucide-react";

export default function SaveButton({
  formId,
  className,
  disabled = true,
  size = 18,
}: {
  formId: string;
  className?: string;
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
      <SaveIcon size={size} className="text-rd" strokeWidth={1.5} />
    </button>
  );
}
