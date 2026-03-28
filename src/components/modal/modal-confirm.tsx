import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function ModalConfirm({
  open,
  setOpen,
  handleConfirm,
  confirmDisabled,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleConfirm: () => void;
  confirmDisabled?: boolean;
}) {
  const t = useTranslations("Home");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogTitle />
        <Button variant="outline" onClick={() => setOpen(false)}>
          {t("cancel")}
        </Button>
        <Button onClick={handleConfirm} disabled={confirmDisabled}>
          {t("confirm")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
