"use client";

import {
  DataPriceList,
  DataStatusParameters,
} from "@/features/setting/model/type";
import { useSearchParams } from "next/navigation";
import StatusMenu from "./menu-status";
import { PriceListBarTable, PriceListCucinaTable } from "./price-list-table";

type InfoPageProps = {
  data: {
    priceList: DataPriceList | null;
    dataStatusParameters: DataStatusParameters | null;
  };
};

export function InfoPage({ data }: InfoPageProps) {
  const tab = useSearchParams().get("tab");
  return (
    <>
      {tab === "statusMenu" && <StatusMenu data={data.dataStatusParameters} />}

      {tab === "price-list-bar" && <PriceListBarTable data={data.priceList} />}
      {tab === "price-list-cucina" && (
        <PriceListCucinaTable data={data.priceList} />
      )}
    </>
  );
}
