"use client";
import { useSearchParams } from "next/navigation";
import { MenuDailyPage } from "../../menu-daily";

import { DataMenu } from "@/features/settings/setting/model/type";

import { MenuDailyForm } from "../../menu-daily/model/schema";
import { MenuVipPage } from "../../menu-vip";
import { MenuWeekForm } from "../../menu-week/model/schema";
import MenuDailyWeek from "../../menu-week/ui/menu-daily-week";

type Props = {
  dataMenuVip: DataMenu | null;
  dataMenuDaily: MenuDailyForm | null;
  listMenuDaily: MenuDailyForm | null;
  dataMenuWeek: MenuWeekForm | null;
};
export function MenuPage({
  dataMenuVip,
  dataMenuDaily,
  listMenuDaily,
  dataMenuWeek,
}: Props) {
  const tab = useSearchParams().get("tab");
  if (tab === "menu-daily") {
    return (
      <MenuDailyPage
        data={listMenuDaily}
        menuDaily={dataMenuDaily}
        qrUrl={dataMenuVip?.cover[0]?.qrUrl}
      />
    );
  }

  if (tab === "menu-vip") {
    return <MenuVipPage data={dataMenuVip} />;
  }

  if (tab === "menu-week") {
    return (
      <MenuDailyWeek
        listMenuDaily={listMenuDaily}
        defaultValues={dataMenuWeek}
      />
    );
  }

  return null;
}
