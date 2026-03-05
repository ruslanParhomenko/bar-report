"use client";

import { useSearchParams } from "next/navigation";
import { Activity } from "react";
import SettingsJsonForm from "./setting-json-form";

export default function SettingPage({
  defaultValue,
}: {
  defaultValue: { productsData: string; breakListData: string };
}) {
  console.log(defaultValue.breakListData);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  return (
    <>
      <Activity mode={tab === "products" ? "visible" : "hidden"}>
        <SettingsJsonForm
          defaultValue={defaultValue.productsData}
          type="products"
        />
      </Activity>
      <Activity mode={tab === "breakList" ? "visible" : "hidden"}>
        <SettingsJsonForm
          defaultValue={defaultValue.breakListData}
          type="breakList"
        />
      </Activity>
    </>
  );
}
