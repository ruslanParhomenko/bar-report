import { cn } from "@/lib/utils";
import { RotateCw } from "lucide-react";

export default function ResetButton({
  className,
  disabled = false,
  size = 18,
  reset,
}: {
  className?: string;
  disabled?: boolean;
  size?: number;
  reset: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        className,
        "flex w-full cursor-pointer items-center justify-center",
      )}
      onClick={() => reset()}
    >
      <RotateCw strokeWidth={1.5} size={size} className="text-rd" />
    </button>
  );
}
