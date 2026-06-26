import { getDataMenu } from "@/app/actions/data-constants/data-menu-action";
import { getDataPriceList } from "@/app/actions/data-constants/data-price-list";
import {
  getMenuCached,
  getStandardKitchenCached,
} from "@/app/actions/google/google-action";
import InfoPage from "@/features/info/info-page";

export default async function Page() {
  const [standardKitchenRes, menuRes, priceList, dataMenu] =
    await Promise.allSettled([
      getStandardKitchenCached(),
      getMenuCached(),
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
        menu: menuRes.status === "fulfilled" ? menuRes.value : null,
        priceList: priceList.status === "fulfilled" ? priceList.value : null,
        dataMenu: dataMenu.status === "fulfilled" ? dataMenu.value : null,
      }}
    />
  );
}
