import { MenuDailyItem } from "@/features/menu/menu-daily/model/schema";

export function InfoDisplay({ item }: { item: MenuDailyItem }) {
  if (!item) {
    return null;
  }
  return (
    <div className="text-center">
      <p className="mb-1 font-['Cormorant_Garamond'] text-[24px] leading-tight font-semibold text-[#2c1f0e]">
        {item.ro}
      </p>
      <p className="min-h-4 font-['Cormorant_Garamond'] text-[12px] font-light text-[#7a6242] italic">
        {item.en}
      </p>
    </div>
  );
}
