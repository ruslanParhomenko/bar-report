import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

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
        <DialogTitle className="hidden" />
        <div className="flex w-full justify-around items-center">
          <Button
            onClick={handleConfirm}
            className="w-30"
            disabled={confirmDisabled}
          >
            {t("confirm")}
          </Button>
          <Button
            variant="destructive"
            className="w-30"
            onClick={() => setOpen(false)}
          >
            {t("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
