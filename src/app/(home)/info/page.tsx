import { getDataPriceList } from "@/app/actions/data-constants/data-price-list";
import {
  getMenuCached,
  getStandardKitchenCached,
} from "@/app/actions/google/google-action";
import { getStopList } from "@/app/actions/stop-list/stop-list-action";
import InfoPage from "@/features/info/info-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { tab } = await searchParams;
  const [standardKitchenRes, menuRes, stopListRes, priceList] =
    await Promise.allSettled([
      getStandardKitchenCached(),
      getMenuCached(),
      getStopList(),
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
        stopList: stopListRes.status === "fulfilled" ? stopListRes.value : null,
        priceList: priceList.status === "fulfilled" ? priceList.value : null,
      }}
      tab={tab}
    />
  );
}
