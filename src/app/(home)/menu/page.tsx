import { getDataMenu } from "@/app/actions/data-constants/data-menu-action";
import { getDataMenuDaily } from "@/app/actions/data-constants/data-menu-daily-action";
import { getMenuDailyData } from "@/app/actions/menu-daily/menu-daily-action";
import MenuPage from "@/features/menu/menu-page";

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
