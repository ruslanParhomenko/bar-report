"use client";
import { deleteUser } from "@/app/actions/users/userAction";
import ModalConfirm from "@/components/modal/ModalConfirm";
import { useRouter } from "@/i18n/navigation";
import { useAbility } from "@/providers/AbilityProvider";
import { Pencil, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function UsersActions({ id }: { id: string }) {
  const router = useRouter();

  const { isAdmin } = useAbility();

  const [open, setOpen] = useState(false);

  const handleDeleteUser = (id: string) =>
    isAdmin ? deleteUser(id) : toast.error("Access denied");

  const handleConfirm = () => {
    setOpen(false);
    handleDeleteUser(id as string);
  };
  return (
    <>
      <ModalConfirm
        open={open}
        setOpen={setOpen}
        handleConfirm={handleConfirm}
        message="delete"
      />
      <div className="flex justify-between gap-4">
        <button
          className="cursor-pointer"
          type="button"
          onClick={() => router.push(`/employees/${id}?tab=create-user`)}
          disabled={!isAdmin}
        >
          <Pencil className="w-4 h-4 text-bl" />
        </button>
        <button
          className="cursor-pointer"
          type="button"
          onClick={() => setOpen(true)}
        >
          <Trash2Icon className="w-4 h-4 text-rd" />
        </button>
      </div>
    </>
  );
}
