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

export default function MenuItemSelect({
  fieldName,
  options,
  placeHolder,
  isDisabled,
}: Props) {
  const { watch, setValue } = useFormContext();
  const current: MenuDailyItem | undefined = watch(fieldName);

  const selectOptions: OptionSelect[] = options.map((item) => ({
    value: item.en,
    label: item.ru,
  }));

  const handleChange = (en: string) => {
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
    />
  );
}
