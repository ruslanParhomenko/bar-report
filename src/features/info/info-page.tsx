"use client";
import { Menu, StandardKitchen } from "@/app/actions/google/google-action";
import { useHashParam } from "@/hooks/use-hash";
import { MenuDaily } from "./menu/menu-daily";
import StaffMenu from "./menu/menu-staff";
import StatusMenu from "./menu/menu-status";
import { MenuVip } from "./menu/menu-vip";
import { PriceListTable } from "./price-list/price-list-table";
import StandardKitchenTable from "./standard/standard-kitchen";
import { StopListSchemaType } from "./stop-list/schema";
import StopListForm from "./stop-list/stop-list-form";

type InfoPageProps = {
  data: {
    standardKitchen: StandardKitchen[] | null;
    menu: Menu | null;
    stopList: StopListSchemaType | null;
    priceList: any | null;
  };
};

export default function InfoPage({ data }: InfoPageProps) {
  const [tab] = useHashParam("tab");

  return (
    <>
      {tab === "stopList" && <StopListForm data={data.stopList || null} />}

      {tab === "daily-menu" && <MenuDaily data={data.menu} />}

      {tab === "statusMenu" && <StatusMenu data={data.menu} />}

      {tab === "staffMenu" && <StaffMenu data={data.menu} />}

      {tab === "menuVip" && <MenuVip data={data.menu} />}
      {tab === "standardKitchen" && (
        <StandardKitchenTable data={data.standardKitchen} />
      )}
      {tab === "price-list" && <PriceListTable data={data.priceList} />}
    </>
  );
}
