import { cn } from "@/lib/utils";
import { LogOut, PenBox } from "lucide-react";

export default function EditButton({
  className,
  disabled = true,
  isEdit,
  setIsEdit,
  size = 21,
}: {
  className?: string;
  disabled?: boolean;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
  size?: number;
}) {
  return (
    <button
      type="button"
      onClick={() => setIsEdit(!isEdit)}
      className={cn(className, "cursor-pointer hover:text-black")}
      disabled={disabled}
    >
      {isEdit ? (
        <LogOut size={size} className="text-rd" strokeWidth={1.5} />
      ) : (
        <PenBox size={size} className="text-bl" strokeWidth={1.5} />
      )}
    </button>
  );
}
