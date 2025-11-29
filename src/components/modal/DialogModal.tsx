import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

export default function DialogModal({
  onConfirmSave,
}: {
  onConfirmSave: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger>save</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Подтверждение</DialogTitle>
        </DialogHeader>
        <p>Вы уверены, что хотите сохранить данные?</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={onConfirmSave}>
              Сохранить
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
