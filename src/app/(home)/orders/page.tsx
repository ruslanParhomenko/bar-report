import { SIDEBAR_NAVIGATION } from "@/constants/sidebar-nav";
import OrdersPage from "@/features/orders/orders-page";

import { checkAccess } from "@/lib/check-access";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ORDERS_MAIN_ROUTE } from "@/constants/endpoint-tag";

const SET_ACCESS =
  SIDEBAR_NAVIGATION.find((item) => item.title === ORDERS_MAIN_ROUTE)
    ?.setAcces || [];
export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  return <OrdersPage />;
}
