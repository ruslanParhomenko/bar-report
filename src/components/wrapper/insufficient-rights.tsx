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
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Label className="text-center text-2xl text-red-600">
        {t("insufficientRights")}
      </Label>
      {exitButton && (
        <Button
          type="button"
          variant={"destructive"}
          className="text-rd cursor-pointer font-bold"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          {t("exit")}
        </Button>
      )}
    </div>
  );
};
