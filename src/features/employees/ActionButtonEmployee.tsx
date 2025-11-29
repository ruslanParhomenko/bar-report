"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useAbility } from "@/providers/AbilityProvider";
import { Minus, PenBox, Pencil, Trash2Icon, TreePalmIcon } from "lucide-react";

export default function ActionButtonEmployee({
  handleDeleteUser,
  handleResetForm,
  id,
}: any) {
  const router = useRouter();
  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;
  return (
    <div className="flex gap-6 justify-center">
      <button
        className="cursor-pointer hover:bg-bl"
        type="button"
        onClick={() => {
          router.push(`/employees/create/${id}`);
        }}
        disabled={isDisabled}
      >
        <PenBox className="h-4 w-4 " />
      </button>
      <button
        className="cursor-pointer hover:bg-rd"
        type="button"
        onClick={() => handleDeleteUser(id as string)}
        disabled={isDisabled}
      >
        <Trash2Icon className="h-4 w-4 hover:text-rd" />
      </button>
      <button
        className="cursor-pointer hover:bg-gn"
        type="button"
        // onClick={() => router.push(`/employees?empId=${id}`)}
      >
        <TreePalmIcon className="h-4 w-4 hover:text-gn" />
      </button>
    </div>
  );
}
