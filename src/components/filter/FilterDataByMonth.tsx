"use client";

import { useState } from "react";
import SelectField from "@/components/inputs/SelectField";
import TextInput from "@/components/inputs/TextInput";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAbility } from "@/providers/AbilityProvider";
import { MONTHS, YEAR } from "@/utils/getMonthDays";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function FilterDataByMonth({
  withButton = false,
  disabled = true,
  onConfirmSave, // 👈 добавляем
}: {
  withButton?: boolean;
  disabled?: boolean;
  onConfirmSave?: () => void; // вызываем отправку формы сверху
}) {
  const t = useTranslations("Home");
  const { isAdmin } = useAbility();
  const isMobile = useIsMobile();
  const orientation = isMobile ? "vertical" : "horizontal";

  const [open, setOpen] = useState(false);

  const classNameBid =
    "md:w-18 p-1 h-8 border-0 shadow-none md:text-xs text-[9px]";

  const handleConfirm = () => {
    setOpen(false);
    onConfirmSave?.(); // 🔥 отправка формы
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите сохранить данные?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleConfirm}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row justify-between pb-2 text-bl">
        <div className="flex gap-4 items-center">
          <SelectField
            fieldName="month"
            data={MONTHS}
            placeHolder="month"
            className="w-24 p-0 h-7! border-bl justify-center"
            disabled={disabled}
          />
          <SelectField
            fieldName="year"
            data={YEAR}
            placeHolder="year"
            className="w-20 p-0 h-7! border-bl justify-center"
            disabled={disabled}
          />

          {withButton && (
            <Button
              type="button"
              className="w-20 p-1 text-xs h-7"
              size="sm"
              disabled={disabled}
              onClick={() => setOpen(true)}
            >
              {t("save")}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <TextInput
            fieldName="waitersDishBid"
            className={classNameBid}
            fieldLabel={isMobile ? "" : "waiters %"}
            orientation={orientation}
            disabled={!isAdmin}
          />
          <TextInput
            fieldName="barmenDishBid"
            className={classNameBid}
            fieldLabel={isMobile ? "" : "barmen %"}
            orientation={orientation}
            disabled={!isAdmin}
          />
          <TextInput
            fieldName="dishDishBid"
            className={classNameBid}
            fieldLabel={isMobile ? "" : "dish %"}
            orientation={orientation}
            disabled={!isAdmin}
          />
          <TextInput
            fieldName="percentTips"
            className={classNameBid}
            fieldLabel={isMobile ? "" : "% tips"}
            orientation={orientation}
            disabled={!isAdmin}
          />
          <TextInput
            fieldName="percentBarmen"
            className={classNameBid}
            fieldLabel={isMobile ? "" : "% barmen"}
            orientation={orientation}
            disabled={!isAdmin}
          />
          <TextInput
            fieldName="percentDish"
            className={classNameBid}
            fieldLabel={isMobile ? "" : "% dish"}
            orientation={orientation}
            disabled={!isAdmin}
          />
        </div>
      </div>
    </>
  );
}
