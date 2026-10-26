import {
  getDataPriceList,
  getDataStatusParameters,
} from "@/features/setting/actions/get-data-json";
import { InfoPage } from "@/features/staff/info";

export default async function Page() {
  const [priceList, dataStatusParameters] = await Promise.allSettled([
    getDataPriceList(),
    getDataStatusParameters(),
  ]);

  return (
    <InfoPage
      data={{
        priceList: priceList.status === "fulfilled" ? priceList.value : null,
        dataStatusParameters:
          dataStatusParameters.status === "fulfilled"
            ? dataStatusParameters.value
            : null,
      }}
    />
  );
}
