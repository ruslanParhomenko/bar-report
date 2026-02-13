"use client";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

export const InsufficientRights = ({
  exitButton,
}: {
  exitButton?: boolean;
}) => {
  const t = useTranslations("Home");
  return (
    <div className="py-20 flex flex-col gap-4 items-center justify-center">
      <Label className="text-2xl text-center text-red-600">
        {t("insufficientRights")}
      </Label>
      {exitButton && (
        <Button
          type="button"
          variant={"destructive"}
          className="text-rd font-bold cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          {t("exit")}
        </Button>
      )}
    </div>
  );
};
