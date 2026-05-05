import { getDataPriceList } from "@/app/actions/data-constants/data-price-list";
import {
  getMenuCached,
  getStandardKitchenCached,
} from "@/app/actions/google/google-action";
import { getStopList } from "@/app/actions/stop-list/stop-list-action";
import { ProtectedPage } from "@/components/wrapper/protected-page";
import { INFO_MAIN_ROUTE } from "@/constants/endpoint-tag";
import InfoPage from "@/features/info/info-page";

export default async function Page() {
  const [standardKitchenRes, menuRes, stopListRes, priceList] =
    await Promise.allSettled([
      getStandardKitchenCached(),
      getMenuCached(),
      getStopList(),
      getDataPriceList(),
    ]);

  return (
    <ProtectedPage route={INFO_MAIN_ROUTE}>
      <InfoPage
        data={{
          standardKitchen:
            standardKitchenRes.status === "fulfilled"
              ? standardKitchenRes.value
              : null,
          menu: menuRes.status === "fulfilled" ? menuRes.value : null,
          stopList:
            stopListRes.status === "fulfilled" ? stopListRes.value : null,
          priceList: priceList.status === "fulfilled" ? priceList.value : null,
        }}
      />
    </ProtectedPage>
  );
}
