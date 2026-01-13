"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function SendResetButton({
  resetForm,
  reset = false,
  refreshUrl,
  returnButton = false,
  isDisabled = false,
}: {
  resetForm?: () => void;
  reset?: boolean;
  refreshUrl?: string;
  returnButton?: boolean;
  isDisabled?: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("Home");

  const [openModal, setOpenModal] = useState<"save" | "reset" | null>(null);

  const isDialogOpen = openModal !== null;

  const handleConfirm = async () => {
    if (openModal === "save") {
      // document.querySelector<HTMLFormElement>("form")?.requestSubmit();
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
      refreshUrl && router.replace(refreshUrl);
    } else if (openModal === "reset") {
      resetForm && resetForm();
    }
    setOpenModal(null);
  };

  return (
    <>
      <div
        className={
          "mt-auto flex flex-col justify-between md:flex-row bottom-0 sticky z-10"
        }
      >
        <div className="flex justify-between md:justify-start items-center  md:gap-10 pt-2">
          <Button
            type="button"
            className="hover:bg-blue-600 bg-bl"
            disabled={isDisabled}
            onClick={() => setOpenModal("save")}
          >
            {t("save")}
          </Button>

          {reset && resetForm && (
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
          {returnButton && (
            <Button
              type="button"
              variant={"destructive"}
              className=""
              onClick={() => router.back()}
            >
              return
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
