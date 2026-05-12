import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function ModalConfirm({
  open,
  setOpen,
  handleConfirm,
  confirmDisabled,
  dialogText = "confirm",
  descriptionText,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleConfirm: () => void;
  confirmDisabled?: boolean;
  dialogText?: string;
  descriptionText?: string;
}) {
  const t = useTranslations("Dialog");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(dialogText)}</DialogTitle>
          <DialogDescription>{descriptionText}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full items-center justify-end gap-8">
            <Button
              onClick={handleConfirm}
              className="w-28"
              disabled={confirmDisabled}
            >
              {t("confirm")}
            </Button>
            <Button
              variant="destructive"
              className="w-28"
              onClick={() => setOpen(false)}
            >
              {t("cancel")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
