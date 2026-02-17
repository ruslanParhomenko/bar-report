"use client";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { PenBox } from "lucide-react";
import { toast } from "sonner";

export default function EditButton({
  className,
  canEdit = true,
  disabled = false,
  url,
}: {
  className?: string;
  canEdit?: boolean;
  disabled?: boolean;
  url: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        canEdit ? router.push(url) : toast.error("Редактирование недоступно");
      }}
      disabled={disabled}
      className={cn("cursor-pointer", className, disabled && "opacity-50")}
    >
      <PenBox className="h-5 w-5 hover:text-bl" strokeWidth={1.5} />
    </button>
  );
}
