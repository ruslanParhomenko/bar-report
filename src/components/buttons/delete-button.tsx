"use client";
import ModalConfirm from "@/components/modal/modal-confirm";
import { useAbility } from "@/providers/ability-provider";
import { Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";

export default function DeleteButton({
  disabled = true,
  dialogText,
  descriptionText,
  onDelete,
}: {
  disabled?: boolean;
  dialogText: string;
  descriptionText: string;
  onDelete: () => Promise<void> | void;
}) {
  const { isAdmin } = useAbility();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    setOpen(false);
    startTransition(async () => {
      await onDelete();
    });
  };

  return (
    <>
      <ModalConfirm
        open={open}
        setOpen={setOpen}
        handleConfirm={handleConfirm}
        dialogText={dialogText}
        descriptionText={descriptionText}
      />
      <button
        className="flex cursor-pointer flex-col items-center gap-0.5"
        type="button"
        onClick={() => setOpen(true)}
        disabled={(disabled && !isAdmin) || isPending}
      >
        <Trash2Icon size={14} className="text-rd hover:text-black" />
      </button>
    </>
  );
}
