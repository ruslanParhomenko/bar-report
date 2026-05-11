"use client";
import { deleteUser } from "@/app/actions/users/user-action";
import ModalConfirm from "@/components/modal/modal-confirm";
import { CREATE_USER_MAIN_ROUTE } from "@/constants/route-tag";
import { useRouter } from "@/i18n/navigation";
import { useAbility } from "@/providers/ability-provider";
import { PenBox, Trash2Icon } from "lucide-react";
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
      />
      <div className="flex justify-center gap-8">
        <button
          className="cursor-pointer"
          type="button"
          onClick={() => router.push(`/${CREATE_USER_MAIN_ROUTE}/${id}`)}
          disabled={!isAdmin}
        >
          <PenBox size={14} className="hover:text-rd" />
        </button>
        <button
          className="cursor-pointer"
          type="button"
          onClick={() => setOpen(true)}
        >
          <Trash2Icon size={14} className="hover:text-rd" />
        </button>
      </div>
    </>
  );
}
