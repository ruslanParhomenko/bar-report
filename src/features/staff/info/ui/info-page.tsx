"use client";
import { Menu, StandardKitchen } from "@/app/actions/google/google-action";
import { DataPriceList } from "@/features/settings/setting/model/type";
import { useSearchParams } from "next/navigation";
import MenuDailyWeek from "./menu-daily-week";
import StaffMenu from "./menu-staff";
import StatusMenu from "./menu-status";
import { PriceListBarTable, PriceListCucinaTable } from "./price-list-table";
import StandardKitchenTable from "./standard-kitchen";

type InfoPageProps = {
  data: {
    standardKitchen: StandardKitchen[] | null;
    menu: Menu | null;
    priceList: DataPriceList | null;
  };
};

export function InfoPage({ data }: InfoPageProps) {
  const tab = useSearchParams().get("tab");
  return (
    <>
      {tab === "statusMenu" && <StatusMenu data={data.menu} />}

      {tab === "staffMenu" && <StaffMenu data={data.menu} />}

      {tab === "standardKitchen" && (
        <StandardKitchenTable data={data.standardKitchen} />
      )}
      {tab === "price-list-bar" && <PriceListBarTable data={data.priceList} />}
      {tab === "price-list-cucina" && (
        <PriceListCucinaTable data={data.priceList} />
      )}
      {tab === "menu-daily-week" && <MenuDailyWeek />}
    </>
  );
}
