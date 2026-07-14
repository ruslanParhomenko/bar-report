"use client";
import { MenuDataType } from "@/app/actions/data-constants/data-menu-action";
import { PriceListType } from "@/app/actions/data-constants/data-price-list";
import { Menu, StandardKitchen } from "@/app/actions/google/google-action";
import { useSearchParams } from "next/navigation";
import StaffMenu from "./menu/menu-staff";
import StatusMenu from "./menu/menu-status";
import { MenuVip } from "./menu/menu-vip";
import {
  PriceListBarTable,
  PriceListCucinaTable,
} from "./price-list/price-list-table";
import StandardKitchenTable from "./standard/standard-kitchen";

type InfoPageProps = {
  data: {
    standardKitchen: StandardKitchen[] | null;
    menu: Menu | null;
    priceList: PriceListType | null;
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
      {tab === "price-list-bar" && <PriceListBarTable data={data.priceList} />}
      {tab === "price-list-cucina" && (
        <PriceListCucinaTable data={data.priceList} />
      )}
    </>
  );
}
