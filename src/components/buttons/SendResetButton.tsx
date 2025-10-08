"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAbility } from "@/providers/AbilityProvider";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SendResetButton({
  resetForm,
  reset = false,
}: {
  resetForm: () => void;
  reset?: boolean;
}) {
  const { isObserver, isUser } = useAbility();
  const isDisabled = isObserver || isUser;
  const t = useTranslations("Home");

  const [openModal, setOpenModal] = useState<"save" | "reset" | null>(null);

  const isDialogOpen = openModal !== null;

  const handleConfirm = () => {
    if (openModal === "save") {
      document.querySelector<HTMLFormElement>("form")?.requestSubmit();
    } else if (openModal === "reset") {
      resetForm();
    }
    setOpenModal(null);
  };

  return (
    <>
      <div
        className={
          "flex flex-col justify-between md:flex-row bottom-2 sticky  bg-background/80 z-10"
        }
      >
        <div className="flex justify-between md:justify-start items-center py-2 md:gap-10">
          <Button
            type="button"
            className="hover:bg-blue-600 bg-bl"
            disabled={isDisabled}
            onClick={() => setOpenModal("save")}
          >
            {t("save")}
          </Button>

          {reset && (
            <Button
              type="button"
              variant="secondary"
              className="hover:bg-rd text-bl hover:text-black"
              disabled={isDisabled}
              onClick={() => setOpenModal("reset")}
            >
              {t("reset")}
            </Button>
          )}
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => !open && setOpenModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {openModal === "save" ? t("confirmSave") : t("confirmReset")}
            </DialogTitle>
            <DialogDescription>
              {openModal === "save" ? t("confirmSave") : t("confirmReset")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenModal(null)}>
              {t("cancel")}
            </Button>
            <Button variant="default" onClick={handleConfirm}>
              {t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
