import { getDataBreakList } from "@/app/actions/data-constants/data-break-action";
import { getDataOrderProducts } from "@/app/actions/data-constants/data-order-products";
import { getDataPriceList } from "@/app/actions/data-constants/data-price-list";
import { getDataProducts } from "@/app/actions/data-constants/data-products-action";
import { getDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import SettingPage from "@/features/setting/setting-page";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { tab } = await searchParams;
  const [
    dataProducts,
    dataBreakList,
    dataOrderProducts,
    dataTTN,
    dataPriceList,
  ] = await Promise.all([
    getDataProducts(),
    getDataBreakList(),
    getDataOrderProducts(),
    getDataTTN(),
    getDataPriceList(),
  ]);

  const data = {
    productsData: JSON.stringify(dataProducts ?? [], null, 2),
    breakListData: JSON.stringify(dataBreakList ?? [], null, 2),
    orderProductsData: JSON.stringify(dataOrderProducts ?? [], null, 2),
    ttnData: JSON.stringify(dataTTN ?? [], null, 2),
    priceListData: JSON.stringify(dataPriceList ?? [], null, 2),
  };

  return <SettingPage data={data} tab={tab} />;
}
