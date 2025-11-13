import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { useAbility } from "@/providers/AbilityProvider";

import { useRouter } from "@/i18n/navigation";
import { defaultSchedule } from "./schema";

export default function ScheduleSelectButtons({
  removeLocalStorageKey,
}: {
  removeLocalStorageKey: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("Home");
  const form = useFormContext();
  const { isAdmin, isMngr } = useAbility();
  const isDisabled = !isAdmin && !isMngr;

  const resetForm = () => {
    form.reset(defaultSchedule);
  };

  return (
    <div className="flex justify-between md:justify-start items-center gap-2 md:gap-6 py-4">
      <Button
        size="sm"
        onClick={() => {
          router.back(), removeLocalStorageKey();
        }}
        variant="outline"
        type="button"
        className="w-16 p-1 text-rd cursor-pointer text-xs"
        disabled={isDisabled}
      >
        {t("exit")}
      </Button>
      <Button
        className="cursor-pointer text-bl text-xs p-1"
        variant="outline"
        size="sm"
        type="button"
        onClick={() => {
          resetForm();
          router.refresh();
        }}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        type="submit"
        className="w-20 p-1 text-xs"
        disabled={isDisabled}
        size="sm"
      >
        {t("save")}
      </Button>
    </div>
  );
}
