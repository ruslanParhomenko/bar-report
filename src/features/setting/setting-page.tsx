"use client";

import { saveSettingsData } from "@/app/actions/settings/settings-action";
import { useFormId } from "@/hooks/use-form-id";
import { useHashParam } from "@/hooks/use-hash";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import SettingsJson from "./setting-json-form";

export default function SettingPage({
  data,
}: {
  data: {
    productsData: string;
    breakListData: string;
    orderProductsData: string;
    ttnData: string;
    priceListData: string;
  };
}) {
  const [tab] = useHashParam("tab");

  const [state, formAction, isPending] = useActionState(saveSettingsData, {});

  const formId = useFormId();

  useEffect(() => {
    if (state?.success) toast.success("Saved successfully");
    if (state?.error) toast.error(state.error);
  }, [state]);

  const configMap = {
    products: {
      data: data.productsData,
      type: "products",
    },
    "break-list": {
      data: data.breakListData,
      type: "breakList",
    },
    "order-products": {
      data: data.orderProductsData,
      type: "orderProducts",
    },
    ttn: {
      data: data.ttnData,
      type: "ttn",
    },
    "price-list": {
      data: data.priceListData,
      type: "priceList",
    },
  } as const;

  const current = configMap[tab as keyof typeof configMap];

  return (
    <form
      key={formId}
      id={formId}
      action={formAction}
      aria-disabled={isPending}
    >
      {current && <SettingsJson data={current.data} type={current.type} />}
    </form>
  );
}
