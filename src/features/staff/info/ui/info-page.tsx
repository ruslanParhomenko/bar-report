"use client";
import { PriceListType } from "@/app/actions/data-constants/data-price-list";
import { Menu, StandardKitchen } from "@/app/actions/google/google-action";
import { useSearchParams } from "next/navigation";
import StaffMenu from "./menu-staff";
import StatusMenu from "./menu-status";
import { PriceListBarTable, PriceListCucinaTable } from "./price-list-table";
import StandardKitchenTable from "./standard-kitchen";

type InfoPageProps = {
  data: {
    standardKitchen: StandardKitchen[] | null;
    menu: Menu | null;
    priceList: PriceListType | null;
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
    </>
  );
}
