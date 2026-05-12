"use client";
import { useRouter } from "@/i18n/navigation";
import { useAbility } from "@/providers/ability-provider";
import { FolderEdit } from "lucide-react";

export default function LinkEditButton({
  url,
  disabled = true,
  size = 16,
}: {
  url: string;
  disabled?: boolean;
  size?: number;
}) {
  const router = useRouter();
  const { isAdmin } = useAbility();

  return (
    <button
      className="flex cursor-pointer flex-col items-center gap-0.5"
      type="button"
      onClick={() => router.push(url)}
      disabled={disabled && !isAdmin}
    >
      <FolderEdit size={size} className="hover:text-rd text-bl" />
    </button>
  );
}
