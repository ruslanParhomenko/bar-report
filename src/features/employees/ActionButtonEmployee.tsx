"use client";
import { deleteEmployee } from "@/app/actions/employees/employeeAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { useAbility } from "@/providers/AbilityProvider";
import { PenBox, Trash2Icon, TreePalmIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ActionButtonEmployee({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;

  const [open, setOpen] = useState(false);

  const viewVacation = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("vacationId", String(id));

    router.push(`/employees?${params.toString()}`);
  };
  const handleDeleteUser = (id: string) =>
    isAdmin ? deleteEmployee(id) : toast.error("Access denied");

  const handleConfirm = () => {
    setOpen(false);
    handleDeleteUser(id as string);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить данные?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleConfirm}>Подтвердить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
          onClick={() => setOpen(true)}
          disabled={isDisabled}
        >
          <Trash2Icon className="h-4 w-4 hover:text-rd" />
        </button>
        <button
          className="cursor-pointer hover:bg-gn"
          type="button"
          onClick={viewVacation}
        >
          <TreePalmIcon className="h-4 w-4 hover:text-gn" />
        </button>
      </div>
    </>
  );
}
