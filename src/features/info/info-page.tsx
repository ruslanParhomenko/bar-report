"use client";
import { Menu, StandardKitchen } from "@/app/actions/google/google-action";
import { useHashParam } from "@/hooks/use-hash";
import { Activity } from "react";
import { MenuDaily } from "./menu/menu-daily";
import StaffMenu from "./menu/menu-staff";
import StatusMenu from "./menu/menu-status";
import { MenuVip } from "./menu/menu-vip";
import StandardKitchenTable from "./standard/standard-kitchen";
import { StopListSchemaType } from "./stop-list/schema";
import StopListForm from "./stop-list/stop-list-form";

type InfoPageProps = {
  data: {
    standardKitchen: StandardKitchen[] | null;
    menu: Menu | null;
    stopList: StopListSchemaType | null;
  };
};

export default function InfoPage({ data }: InfoPageProps) {
  const [tab] = useHashParam("tab");

  return (
    <>
      <Activity mode={tab === "stopList" ? "visible" : "hidden"}>
        <StopListForm data={data.stopList || null} />;
      </Activity>
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
