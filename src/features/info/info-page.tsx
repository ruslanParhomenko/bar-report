"use client";
import { MenuDataType } from "@/app/actions/data-constants/data-menu-action";
import { Menu, StandardKitchen } from "@/app/actions/google/google-action";
import { useSearchParams } from "next/navigation";
import StaffMenu from "./menu/menu-staff";
import StatusMenu from "./menu/menu-status";
import { MenuVip } from "./menu/menu-vip";
import { PriceListTable } from "./price-list/price-list-table";
import StandardKitchenTable from "./standard/standard-kitchen";

type InfoPageProps = {
  data: {
    standardKitchen: StandardKitchen[] | null;
    menu: Menu | null;
    priceList: any | null;
    dataMenu: MenuDataType | null;
  };
};

export default function InfoPage({ data }: InfoPageProps) {
  const tab = useSearchParams().get("tab");
  return (
    <>
      {tab === "statusMenu" && <StatusMenu data={data.menu} />}

      {tab === "staffMenu" && <StaffMenu data={data.menu} />}

      {tab === "menuVip" && <MenuVip data={data.dataMenu} />}
      {tab === "standardKitchen" && (
        <StandardKitchenTable data={data.standardKitchen} />
      )}
      {tab === "price-list" && <PriceListTable data={data.priceList} />}
    </>
  );
}
