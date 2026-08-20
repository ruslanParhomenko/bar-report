"use client";

import SelectInput, { OptionSelect } from "@/components/select/select-input";
import { useFormContext } from "react-hook-form";
import { MenuDailyItem } from "../../menu-daily/model/schema";

type Props = {
  fieldName: string;
  options: MenuDailyItem[];
  placeHolder?: string;
  isDisabled?: boolean;
};

const EMPTY_MENU_ITEM: MenuDailyItem = {
  en: "-",
  ru: "-",
  ro: "-",
  tr: "-",
  he: "-",
};

export default function MenuItemSelect({
  fieldName,
  options,
  placeHolder,
  isDisabled,
}: Props) {
  const { watch, setValue } = useFormContext();
  const current: MenuDailyItem | undefined = watch(fieldName);

  const selectOptions: OptionSelect[] = [
    {
      value: "-",
      label: "-",
    },
    ...options.map((item) => ({
      value: item.en,
      label: item.ru,
    })),
  ];

  const handleChange = (en: string) => {
    if (en === "-") {
      setValue(fieldName, EMPTY_MENU_ITEM, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }
    const found = options.find((item) => item.en === en);
    if (found) {
      setValue(fieldName, found, { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <SelectInput
      options={selectOptions}
      placeHolder={placeHolder ?? "Выбрать блюдо"}
      value={current?.en ?? ""}
      onChange={handleChange}
      fieldName={fieldName}
      disabled={isDisabled}
      className="print:text-bl! print:text-md! h-6! print:h-10"
    />
  );
}
