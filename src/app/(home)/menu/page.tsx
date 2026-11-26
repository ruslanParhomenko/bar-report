import { getMenuDailyData } from "@/features/menu/menu-daily/actions/get-menu-daily";
import {
  getDataMenu,
  getDataMenuDaily,
} from "@/features/setting/actions/get-data-json";

import { InfoBuffetPage } from "@/features/menu/info-buffet";
import { MenuDailyPage } from "@/features/menu/menu-daily";
import { MenuVipPage } from "@/features/menu/menu-vip";
import { MenuDailyWeek } from "@/features/menu/menu-week";
import { getMenuWeekData } from "@/features/menu/menu-week/actions/get-menu-week";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>;
}) {
  const { tab } = await searchParams;
  if (!tab) return null;

  if (tab === "menu-daily") {
    const [listMenuDaily, dataMenuDaily, dataMenuVip] = await Promise.all([
      getDataMenuDaily(),
      getMenuDailyData(),
      getDataMenu(),
    ]);
    return (
      <MenuDailyPage
        data={listMenuDaily}
        menuDaily={dataMenuDaily}
        qrUrl={dataMenuVip?.cover[0]?.qrUrl}
      />
    );
  }

  if (tab === "menu-week") {
    const [listMenuDaily, dataMenuWeek] = await Promise.all([
      getDataMenuDaily(),
      getMenuWeekData(),
    ]);
    return (
      <MenuDailyWeek
        listMenuDaily={listMenuDaily}
        defaultValues={dataMenuWeek}
      />
    );
  }

  if (tab === "menu-vip") {
    const [dataMenuVip] = await Promise.all([getDataMenu()]);
    return <MenuVipPage data={dataMenuVip} />;
  }

  if (tab === "info-buffet") {
    const [dataMenuDaily, dataMenuVip] = await Promise.all([
      getMenuDailyData(),
      getDataMenu(),
    ]);
    return (
      <InfoBuffetPage
        menuDaily={dataMenuDaily}
        qrUrl={dataMenuVip?.cover[0]?.qrUrl}
      />
    );
  }
}
