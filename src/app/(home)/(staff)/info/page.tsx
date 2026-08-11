import {
  getMenuCached,
  getStandardKitchenCached,
} from "@/app/actions/google/google-action";
import { getDataPriceList } from "@/features/settings/setting/actions/get-data-json";
import { InfoPage } from "@/features/staff/info";

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
