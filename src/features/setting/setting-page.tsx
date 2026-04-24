"use client";

import { useHashParam } from "@/hooks/use-hash";
import { Activity } from "react";
import SettingsJsonForm from "./setting-json-form";

export default function SettingPage({
  defaultValue,
}: {
  defaultValue: {
    productsData: string;
    breakListData: string;
    orderProductsData: string;
    ttnData: string;
  };
}) {
  const [tab] = useHashParam("tab");

  return (
    <>
      <Activity mode={tab === "products" ? "visible" : "hidden"}>
        <SettingsJsonForm
          defaultValue={defaultValue.productsData}
          type="products"
        />
      </Activity>
      <Activity mode={tab === "break-list" ? "visible" : "hidden"}>
        <SettingsJsonForm
          defaultValue={defaultValue.breakListData}
          type="breakList"
        />
      </Activity>
      <Activity mode={tab === "order-products" ? "visible" : "hidden"}>
        <SettingsJsonForm
          defaultValue={defaultValue.orderProductsData}
          type="orderProducts"
        />
      </Activity>
      <Activity mode={tab === "ttn" ? "visible" : "hidden"}>
        <SettingsJsonForm defaultValue={defaultValue.ttnData} type="ttn" />
      </Activity>
    </>
  );
}
