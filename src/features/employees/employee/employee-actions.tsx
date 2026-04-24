"use client";
import { deleteEmployee } from "@/app/actions/employees/employee-action";
import ModalConfirm from "@/components/modal/modal-confirm";
import { useRouter } from "@/i18n/navigation";
import { useAbility } from "@/providers/ability-provider";
import { PenBox, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ActionButtonEmployee({ id }: { id: string }) {
  const router = useRouter();

  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;

  const [open, setOpen] = useState(false);

  const handleDeleteUser = (id: string) =>
    isAdmin ? deleteEmployee(id) : toast.error("Access denied");

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
          onClick={() => {
            router.push(`/create-employees/${id}`);
          }}
          disabled={isDisabled}
        >
          <PenBox className="hover:text-rd h-4 w-4" />
        </button>
        <button
          className="cursor-pointer"
          type="button"
          onClick={() => setOpen(true)}
          disabled={isDisabled}
        >
          <Trash2Icon className="hover:text-rd h-4 w-4" />
        </button>
      </div>
    </>
  );
}
