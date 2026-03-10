import { getDataBreakList } from "@/app/actions/data-constants/data-break-action";
import { getDataOrderProducts } from "@/app/actions/data-constants/data-order-products";
import { getDataProducts } from "@/app/actions/data-constants/data-products-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import SettingPage from "@/features/setting/setting-page";
import { checkAccess } from "@/lib/check-access";
const SET_ACCESS = ["ADMIN"];

export default async function SettingsPage() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const [dataProducts, dataBreakList, dataOrderProducts] = await Promise.all([
    getDataProducts(),
    getDataBreakList(),
    getDataOrderProducts(),
  ]);

  const defaultValue = {
    productsData: JSON.stringify(dataProducts ?? [], null, 2),
    breakListData: JSON.stringify(dataBreakList ?? [], null, 2),
    orderProductsData: JSON.stringify(dataOrderProducts ?? [], null, 2),
  };

  return <SettingPage defaultValue={defaultValue} />;
}
