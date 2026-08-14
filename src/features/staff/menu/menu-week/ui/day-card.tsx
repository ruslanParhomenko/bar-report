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
  console.log("menuData", menuData);
  return (
    <div className="bg-card flex flex-col justify-between gap-8 rounded-xl border p-4">
      <p className="text-sm font-medium">{dayLabel}</p>
      {SECTIONS.map((section) => (
        <div key={section} className="flex flex-col gap-4">
          <span className="text-muted-foreground text-xs">
            {SECTION_LABELS[section]}
          </span>
          <div className="flex flex-col gap-1.5">
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
