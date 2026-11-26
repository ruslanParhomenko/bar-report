import {
  getDataPriceList,
  getDataStatusParameters,
} from "@/features/setting/actions/get-data-json";
import { InfoPage } from "@/features/staff/info";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>;
}) {
  const { tab } = await searchParams;
  if (!tab) return null;

  const [priceList, dataStatusParameters] = await Promise.allSettled([
    getDataPriceList(),
    getDataStatusParameters(),
  ]);

  const priceListData =
    priceList.status === "fulfilled" ? priceList.value : null;
  const dataStatusParametersData =
    dataStatusParameters.status === "fulfilled"
      ? dataStatusParameters.value
      : null;

  return (
    <InfoPage
      priceList={priceListData}
      dataStatusParameters={dataStatusParametersData}
      tab={tab}
    />
  );
}
