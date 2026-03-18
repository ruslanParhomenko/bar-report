import { getDataBreakList } from "@/app/actions/data-constants/data-break-action";
import { getDataOrderProducts } from "@/app/actions/data-constants/data-order-products";
import { getDataProducts } from "@/app/actions/data-constants/data-products-action";
import { getDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import SettingPage from "@/features/setting/setting-page";
import { checkAccess } from "@/lib/check-access";
import { da } from "zod/v4/locales";
const SET_ACCESS = ["ADMIN"];

export default async function SettingsPage() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const [dataProducts, dataBreakList, dataOrderProducts, dataTTN] =
    await Promise.all([
      getDataProducts(),
      getDataBreakList(),
      getDataOrderProducts(),
      getDataTTN(),
    ]);

  const defaultValue = {
    productsData: JSON.stringify(dataProducts ?? [], null, 2),
    breakListData: JSON.stringify(dataBreakList ?? [], null, 2),
    orderProductsData: JSON.stringify(dataOrderProducts ?? [], null, 2),
    ttnData: JSON.stringify(dataTTN ?? [], null, 2),
  };

  return <SettingPage defaultValue={defaultValue} />;
}
