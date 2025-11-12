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

export function SaveButton() {
  const [openModal, setOpenModal] = useState<"save" | "reset" | null>(null);

  const isDialogOpen = openModal !== null;

  const { isBar, isAdmin } = useAbility();
  const isDisabled = !isAdmin && !isBar;
  const t = useTranslations("Home");

  const handleConfirm = async () => {
    if (openModal === "save") {
      const forms = Array.from(
        document.querySelectorAll<HTMLFormElement>("form")
      );

      for (const form of forms) {
        await new Promise<void>((resolve) => {
          const listener = () => {
            form.removeEventListener("submit", listener);
            resolve();
          };
          form.addEventListener("submit", listener);
          form.requestSubmit();
        });
      }
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
            onClick={() => setOpenModal("save")}
            disabled={isDisabled}
          >
            {t("save")}
          </Button>
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
