import { getDataMenu } from "@/app/actions/data-constants/data-menu-action";
import { getDataMenuDaily } from "@/app/actions/data-constants/data-menu-daily-action";
import { getDataPriceList } from "@/app/actions/data-constants/data-price-list";
import {
  getMenuCached,
  getStandardKitchenCached,
} from "@/app/actions/google/google-action";
import { getStopList } from "@/app/actions/stop-list/stop-list-action";
import InfoPage from "@/features/info/info-page";

export default async function Page() {
  const [
    standardKitchenRes,
    menuRes,
    menuDaily,
    stopListRes,
    priceList,
    dataMenu,
  ] = await Promise.allSettled([
    getStandardKitchenCached(),
    getMenuCached(),
    getDataMenuDaily(),
    getStopList(),
    getDataPriceList(),
    getDataMenu(),
  ]);

  return (
    <InfoPage
      data={{
        standardKitchen:
          standardKitchenRes.status === "fulfilled"
            ? standardKitchenRes.value
            : null,
        menuDaily: menuDaily.status === "fulfilled" ? menuDaily.value : null,
        menu: menuRes.status === "fulfilled" ? menuRes.value : null,
        stopList: stopListRes.status === "fulfilled" ? stopListRes.value : null,
        priceList: priceList.status === "fulfilled" ? priceList.value : null,
        dataMenu: dataMenu.status === "fulfilled" ? dataMenu.value : null,
      }}
    />
  );
}
