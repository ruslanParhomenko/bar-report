import OrdersPage from "@/features/orders/orders-page";

import { checkAccess } from "@/lib/check-access";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ORDERS_MAIN_ROUTE } from "@/constants/endpoint-tag";

export default async function Page() {
  const hasAccess = await checkAccess(ORDERS_MAIN_ROUTE);
  if (!hasAccess) return <InsufficientRights />;
  return <OrdersPage />;
}
