import {
  getDataMenu,
  getDataMenuDaily,
} from "@/features/settings/setting/actions/get-data-json";
import { getMenuDailyData } from "@/features/staff/menu/menu-daily/actions/get-menu-daily";

import { MenuPage } from "@/features/staff/menu/menu-page";

export default async function Page() {
  const [dataMenuVip, dataMenuDaily, listMenuDaily] = await Promise.all([
    getDataMenu(),
    getMenuDailyData(),
    getDataMenuDaily(),
  ]);

  return (
    <MenuPage
      dataMenuVip={dataMenuVip}
      dataMenuDaily={dataMenuDaily}
      listMenuDaily={listMenuDaily}
    />
  );
}
