import {
  getDataMenu,
  getDataMenuDaily,
} from "@/features/settings/setting/actions/get-data-json";
import { getMenuDailyData } from "@/features/staff/menu/menu-daily/actions/get-menu-daily";

import { MenuPage } from "@/features/staff/menu/menu-page";
import { getMenuWeekData } from "@/features/staff/menu/menu-week/actions/get-menu-week";

export default async function Page() {
  const [dataMenuVip, dataMenuDaily, listMenuDaily, dataMenuWeek] =
    await Promise.all([
      getDataMenu(),
      getMenuDailyData(),
      getDataMenuDaily(),
      getMenuWeekData(),
    ]);

  return (
    <MenuPage
      dataMenuVip={dataMenuVip}
      dataMenuDaily={dataMenuDaily}
      listMenuDaily={listMenuDaily}
      dataMenuWeek={dataMenuWeek}
    />
  );
}
