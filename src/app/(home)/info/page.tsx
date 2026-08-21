import {
  getDataPriceList,
  getDataStatusParameters,
} from "@/features/setting/actions/get-data-json";
import { InfoPage } from "@/features/staff/info";
import { headers } from "next/headers";

export default async function Page() {
  const headerStore = await headers();
  const isAdmin = headerStore.get("x-is-admin") === "true";
  const [priceList, dataStatusParameters] = await Promise.allSettled([
    getDataPriceList(),
    getDataStatusParameters(),
  ]);

  return (
    <InfoPage
      isAdmin={isAdmin}
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
