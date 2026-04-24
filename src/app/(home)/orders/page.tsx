import OrdersPage from "@/features/orders/orders-page";

import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ORDERS_MAIN_ROUTE } from "@/constants/endpoint-tag";
import { checkAccess } from "@/lib/check-access";

export default async function Page() {
  const hasAccess = await checkAccess(ORDERS_MAIN_ROUTE);
  if (!hasAccess) return <InsufficientRights />;
  return <OrdersPage />;
}
