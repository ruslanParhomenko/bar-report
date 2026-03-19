"use client";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useAbility } from "@/providers/ability-provider";
import { PenBox } from "lucide-react";
import { toast } from "sonner";

export default function EditButton({
  className,
  canEdit = true,
  url,
}: {
  className?: string;
  canEdit?: boolean;
  url: string;
}) {
  const router = useRouter();
  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;
  return (
    <button
      type="button"
      onClick={() => {
        canEdit || isAdmin
          ? router.push(url)
          : toast.error("Редактирование недоступно");
      }}
      disabled={isDisabled}
      className={cn("cursor-pointer", className, isDisabled && "opacity-50")}
    >
      <PenBox className="h-5 w-5 hover:text-bl" strokeWidth={1.5} />
    </button>
  );
}
