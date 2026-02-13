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
  message,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleConfirm: () => void;
  message: "save" | "reset" | "delete" | "send";
}) {
  const t = useTranslations("Home");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <p>
          {t("do you want to")} {t(message)} {t("data")}?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleConfirm}>{t("confirm")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
