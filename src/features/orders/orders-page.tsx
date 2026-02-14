"use client";

import { useSearchParams } from "next/navigation";
import { Activity } from "react";
import { OrderListTTNBar } from "./order-bar-ttn";
import { OrderListBar } from "./order-bar-zn";
import { OrderListTTNCucina } from "./order-cucina-ttn";
import { OrderListCucina } from "./order-cucina-zn";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";
import { useAbility } from "@/providers/AbilityProvider";

const FORM_PROPS = {
  "bar-ttn": {
    user: "barTTN",
    url: "ttn",
  },
  "bar-zn": {
    user: "barZN",
    url: "zn",
  },
  "cucina-ttn": {
    user: "cucinaTTN",
    url: "ttn",
  },
  "cucina-zn": {
    user: "cucinaZN",
    url: "zn",
  },
};

export default function OrdersPage() {
  const { isBar, isCucina } = useAbility();
  const isDisabled = !isBar && !isCucina;
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as string;
  const user = FORM_PROPS[tab as keyof typeof FORM_PROPS]?.user;
  const url = FORM_PROPS[tab as keyof typeof FORM_PROPS]?.url;
  return (
    <OrderListTelegramForm user={user} url={url} isDisabled={isDisabled}>
      <Activity mode={tab === "bar-ttn" ? "visible" : "hidden"}>
        <OrderListTTNBar />
      </Activity>
      <Activity mode={tab === "bar-zn" ? "visible" : "hidden"}>
        <OrderListBar />
      </Activity>
      <Activity mode={tab === "cucina-ttn" ? "visible" : "hidden"}>
        <OrderListTTNCucina />
      </Activity>
      <Activity mode={tab === "cucina-zn" ? "visible" : "hidden"}>
        <OrderListCucina />
      </Activity>
    </OrderListTelegramForm>
  );
}
