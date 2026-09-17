"use client";

import { useEdit } from "@/providers/edit-provider";
import { MenuDailyItem } from "../../menu-daily/model/schema";
import { SECTION_LABELS, SECTIONS } from "../config/constants";
import { MenuWeekForm } from "../model/schema";
import MenuItemSelect from "./menu-item-select";
import MenuItemView from "./menu-item-view";

type Props = {
  dayKey: string;
  dayLabel: string;
  menuData: Record<(typeof SECTIONS)[number], MenuDailyItem[]>;
  defaultValuesByDay: MenuWeekForm[keyof MenuWeekForm] | undefined;
};

export default function DayCard({
  dayKey,
  dayLabel,
  menuData,
  defaultValuesByDay: defaultValues,
}: Props) {
  const { isEdit } = useEdit();

  return (
    <div className="bg-card flex w-full flex-col justify-between gap-0.5 rounded-xl border p-2 md:w-80">
      <p className="text-bl text-xs font-medium print:text-lg">{dayLabel}</p>

      {SECTIONS.map((section) => (
        <div key={section} className="flex flex-col">
          <span className="text-muted-foreground text-xs">
            {SECTION_LABELS[section]}
          </span>

          <div className="flex flex-col">
            {[0, 1, 2].map((index) =>
              isEdit ? (
                <MenuItemSelect
                  key={index}
                  fieldName={`${dayKey}.${section}.${index}`}
                  options={menuData[section]}
                />
              ) : (
                <MenuItemView
                  key={index}
                  item={defaultValues?.[section]?.[index]}
                />
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
