import { getDataMenuDaily } from "@/app/actions/data-constants/data-menu-daily-action";
import { getMenuDailyData } from "@/app/actions/menu-daily/menu-daily-action";
import MenuDailyPage from "@/features/menu/menu-daily/menu-daily-page";

export default async function Page() {
  const data = await getDataMenuDaily();

  const saveMenuDaily = await getMenuDailyData();

  return <MenuDailyPage data={data} menuDaily={saveMenuDaily} />;
}
