"use client";
import { MenuDataType } from "@/app/actions/data-constants/data-menu-action";
import { useSearchParams } from "next/navigation";
import MenuDailyPage from "./menu-daily/menu-daily-page";
import { MenuDailyForm } from "./menu-daily/schema";
import MenuVip from "./menu-vip/menu-vip";

type Props = {
  dataMenuVip: MenuDataType | null;
  dataMenuDaily: MenuDailyForm | null;
  listMenuDaily: MenuDailyForm | null;
};
export default function MenuPage({
  dataMenuVip,
  dataMenuDaily,
  listMenuDaily,
}: Props) {
  const tab = useSearchParams().get("tab");
  if (tab === "menu-daily") {
    return <MenuDailyPage data={listMenuDaily} menuDaily={dataMenuDaily} />;
  }

  if (tab === "menu-vip") {
    return <MenuVip data={dataMenuVip} />;
  }

  return null;
}
