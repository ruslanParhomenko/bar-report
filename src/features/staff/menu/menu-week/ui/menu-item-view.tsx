import { MenuDailyItem } from "../../menu-daily/model/schema";

export default function MenuItemView({
  item,
}: {
  item: MenuDailyItem | undefined;
}) {
  return (
    <div className="flex h-6 items-center rounded-md px-2 text-sm print:h-10 print:text-base">
      {item?.ru ?? "-"}
    </div>
  );
}
