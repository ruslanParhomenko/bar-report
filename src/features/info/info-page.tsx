"use client";
import { useSearchParams } from "next/navigation";
import { Activity } from "react";
import StandardKitchenTable from "./StandardKitchenTable";
import { MenuDaily } from "./MenuDaily";
import StatusMenu from "./StatusMenu";
import StaffMenu from "./StaffMenu";
import { MenuVip } from "./MenuVip";
import { Menu, StandardKitchen } from "@/app/actions/google/googleSheetAction";

type TabValue =
  | "daily-menu"
  | "statusMenu"
  | "staffMenu"
  | "menuVip"
  | "standardKitchen";

type InfoPageProps = {
  data: {
    standardKitchen: StandardKitchen[];
    menu: Menu;
  };
};

export default function InfoPage({ data }: InfoPageProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as TabValue;

  console.log(data);
  return (
    <>
      <Activity mode={tab === "daily-menu" ? "visible" : "hidden"}>
        <MenuDaily data={data.menu} />
      </Activity>

      <Activity mode={tab === "statusMenu" ? "visible" : "hidden"}>
        <StatusMenu data={data.menu} />
      </Activity>

      <Activity mode={tab === "staffMenu" ? "visible" : "hidden"}>
        <StaffMenu data={data.menu} />
      </Activity>

      <Activity mode={tab === "menuVip" ? "visible" : "hidden"}>
        <MenuVip data={data.menu} />
      </Activity>
      <Activity mode={tab === "standardKitchen" ? "visible" : "hidden"}>
        <StandardKitchenTable data={data.standardKitchen} />
      </Activity>
    </>
  );
}
