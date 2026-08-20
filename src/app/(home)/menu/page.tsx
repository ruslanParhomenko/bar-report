import {
  getDataMenu,
  getDataMenuDaily,
} from "@/features/setting/actions/get-data-json";
import { getMenuDailyData } from "@/features/staff/menu/menu-daily/actions/get-menu-daily";

import { MenuPage } from "@/features/staff/menu/menu-page";
import { getMenuWeekData } from "@/features/staff/menu/menu-week/actions/get-menu-week";

export default async function Page() {
  const [dataMenuVip, dataMenuDaily, listMenuDaily, dataMenuWeek] =
    await Promise.allSettled([
      getDataMenu(),
      getMenuDailyData(),
      getDataMenuDaily(),
      getMenuWeekData(),
    ]);

  return (
    <MenuPage
      dataMenuVip={
        dataMenuVip.status === "fulfilled" ? dataMenuVip.value : null
      }
      dataMenuDaily={
        dataMenuDaily.status === "fulfilled" ? dataMenuDaily.value : null
      }
      listMenuDaily={
        listMenuDaily.status === "fulfilled" ? listMenuDaily.value : null
      }
      dataMenuWeek={
        dataMenuWeek.status === "fulfilled" ? dataMenuWeek.value : null
      }
    />
  );
}
