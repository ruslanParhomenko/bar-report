import { getDataPriceList } from "@/app/actions/data-constants/data-price-list";
import {
  getMenuCached,
  getStandardKitchenCached,
} from "@/app/actions/google/google-action";
import InfoPage from "@/features/info/info-page";

export default async function Page() {
  const [standardKitchenRes, menuRes, priceList] = await Promise.allSettled([
    getStandardKitchenCached(),
    getMenuCached(),
    getDataPriceList(),
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
      }}
    />
  );
}
