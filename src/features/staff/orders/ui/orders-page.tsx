"use client";

import { DataOrderProducts } from "@/features/settings/setting/model/type";
import { useSearchParams } from "next/navigation";
import { OrderForm } from "./order-form";

export function OrdersPage({
  orderProducts,
}: {
  orderProducts: DataOrderProducts;
}) {
  const tab = useSearchParams().get("tab");

  const DATA_COMPONENT_BY_TAB = {
    "bar-ttn": orderProducts.ttnBar || {},
    "bar-zn": orderProducts.bar || {},
    "cucina-ttn": orderProducts.ttnCucina || {},
    "cucina-zn": orderProducts.cucina || {},
    "tech-ttn": orderProducts.techTTN || {},
  };

  return (
    <OrderForm
      key={tab}
      data={DATA_COMPONENT_BY_TAB[tab as keyof typeof DATA_COMPONENT_BY_TAB]}
      tab={tab as string}
    />
  );
}
