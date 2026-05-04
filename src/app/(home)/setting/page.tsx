import { getDataBreakList } from "@/app/actions/data-constants/data-break-action";
import { getDataOrderProducts } from "@/app/actions/data-constants/data-order-products";
import { getDataProducts } from "@/app/actions/data-constants/data-products-action";
import { getDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { ProtectedPage } from "@/components/wrapper/protected-page";
import { SETTING_MAIN_ROUTE } from "@/constants/endpoint-tag";
import SettingPage from "@/features/setting/setting-page";

export default async function SettingsPage() {
  const [dataProducts, dataBreakList, dataOrderProducts, dataTTN] =
    await Promise.all([
      getDataProducts(),
      getDataBreakList(),
      getDataOrderProducts(),
      getDataTTN(),
    ]);

  const data = {
    productsData: JSON.stringify(dataProducts ?? [], null, 2),
    breakListData: JSON.stringify(dataBreakList ?? [], null, 2),
    orderProductsData: JSON.stringify(dataOrderProducts ?? [], null, 2),
    ttnData: JSON.stringify(dataTTN ?? [], null, 2),
  };

  return (
    <ProtectedPage route={SETTING_MAIN_ROUTE}>
      <SettingPage data={data} />
    </ProtectedPage>
  );
}
