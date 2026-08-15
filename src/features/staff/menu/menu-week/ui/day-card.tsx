"use client";

import { MenuDailyItem } from "../../menu-daily/model/schema";
import { SECTION_LABELS, SECTIONS } from "../config/constants";
import MenuItemSelect from "./menu-item-select";

type Props = {
  dayKey: string;
  dayLabel: string;
  menuData: Record<(typeof SECTIONS)[number], MenuDailyItem[]>;
  isDisabled?: boolean;
};

export default function DayCard({
  dayKey,
  dayLabel,
  menuData,
  isDisabled,
}: Props) {
  return (
    <div className="bg-card flex w-full flex-col justify-between gap-1 rounded-xl border p-4 md:w-80">
      <p className="text-bl text-xs font-medium print:text-lg">{dayLabel}</p>
      {SECTIONS.map((section) => (
        <div key={section} className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">
            {SECTION_LABELS[section]}
          </span>
          <div className="flex flex-col">
            <MenuItemSelect
              fieldName={`${dayKey}.${section}.0`}
              options={menuData[section]}
              key={`${dayKey}.${section}.0`}
              isDisabled={isDisabled}
            />
            <MenuItemSelect
              fieldName={`${dayKey}.${section}.1`}
              options={menuData[section]}
              key={`${dayKey}.${section}.1`}
              isDisabled={isDisabled}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
