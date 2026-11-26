import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ORDERS_MAIN_ROUTE } from "@/constants/route-tag";
import { getDataOrderProducts } from "@/features/setting/actions/get-data-json";
import OrderPage from "@/features/staff/orders/ui/order-page";
import { requireTabAccess } from "@/lib/access";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>;
}) {
  const { tab } = await searchParams;
  if (!tab) return null;

  const { user } = await requireTabAccess(ORDERS_MAIN_ROUTE, tab);

  if (!user) {
    return <InsufficientRights />;
  }
  const ordersData = await getDataOrderProducts();

  if (!ordersData) return null;

  const DATA_COMPONENT_BY_TAB = {
    "bar-ttn": ordersData.ttnBar || {},
    "bar-zn": ordersData.bar || {},
    "cucina-ttn": ordersData.ttnCucina || {},
    "cucina-zn": ordersData.cucina || {},
    "tech-ttn": ordersData.techTTN || {},
  };

  return (
    <OrderPage
      key={tab}
      data={DATA_COMPONENT_BY_TAB[tab as keyof typeof DATA_COMPONENT_BY_TAB]}
      tab={tab as string}
    />
  );
}
