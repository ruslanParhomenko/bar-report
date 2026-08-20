"use client";
import {
  DATA_BREAK_ACTION_TAG,
  DATA_MENU_ACTION_TAG,
  DATA_MENU_DAILY_ACTION_TAG,
  DATA_ORDER_PRODUCTS_ACTION_TAG,
  DATA_PRICE_LIST_ACTION_TAG,
  DATA_PRODUCTS_ACTION_TAG,
  DATA_STATUS_PARAMETERS_ACTION_TAG,
  DATA_TTN_ACTION_TAG,
} from "@/constants/action-tag";
import { useFormId } from "@/hooks/use-form-id";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { saveSettingsData } from "../actions/create-data-json";
import SettingsJson from "./setting-json-form";

export function SettingPage({
  data,
}: {
  data: {
    productsData: string;
    breakListData: string;
    orderProductsData: string;
    ttnData: string;
    priceListData: string;
    menuData: string;
    menuDailyData: string;
    statusParametersData: string;
  };
}) {
  const tab = useSearchParams().get("tab");

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
      tag: DATA_PRODUCTS_ACTION_TAG,
    },
    "break-list": {
      data: data.breakListData,
      type: "breakList",
      tag: DATA_BREAK_ACTION_TAG,
    },
    "order-products": {
      data: data.orderProductsData,
      type: "orderProducts",
      tag: DATA_ORDER_PRODUCTS_ACTION_TAG,
    },
    ttn: {
      data: data.ttnData,
      type: "ttn",
      tag: DATA_TTN_ACTION_TAG,
    },
    "price-list": {
      data: data.priceListData,
      type: "priceList",
      tag: DATA_PRICE_LIST_ACTION_TAG,
    },
    menu: {
      data: data.menuData,
      type: "menu",
      tag: DATA_MENU_ACTION_TAG,
    },
    "menu-daily": {
      data: data.menuDailyData,
      type: "menuDaily",
      tag: DATA_MENU_DAILY_ACTION_TAG,
    },
    "data-status-parameters": {
      data: data.statusParametersData,
      type: "statusParameters",
      tag: DATA_STATUS_PARAMETERS_ACTION_TAG,
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
      {current && (
        <SettingsJson
          data={current.data}
          type={current.type}
          tag={current.tag}
        />
      )}
    </form>
  );
}
