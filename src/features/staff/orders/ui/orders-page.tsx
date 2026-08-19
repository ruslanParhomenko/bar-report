"use client";

import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { DataOrderProducts } from "@/features/settings/setting/model/type";
import { useAccessCheck } from "@/hooks/use-tab-access";
import { useSearchParams } from "next/navigation";
import { OrderForm } from "./order-form";

export function OrdersPage({
  orderProducts,
}: {
  orderProducts: DataOrderProducts;
}) {
  const hasAccess = useAccessCheck();
  const tab = useSearchParams().get("tab");

  const DATA_COMPONENT_BY_TAB = {
    "bar-ttn": orderProducts.ttnBar || {},
    "bar-zn": orderProducts.bar || {},
    "cucina-ttn": orderProducts.ttnCucina || {},
    "cucina-zn": orderProducts.cucina || {},
    "tech-ttn": orderProducts.techTTN || {},
  };

  if (!hasAccess) return <InsufficientRights />;

  return (
    <OrderForm
      key={tab}
      data={DATA_COMPONENT_BY_TAB[tab as keyof typeof DATA_COMPONENT_BY_TAB]}
      tab={tab as string}
    />
  );
}
