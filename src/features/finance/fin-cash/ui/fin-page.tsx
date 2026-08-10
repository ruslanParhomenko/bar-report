"use client";

import { useSearchParams } from "next/navigation";

import { GetFinData } from "../model/type";
import FinBar from "./fin-bar/fin-bar";
import FinNori from "./fin-nori/fin-nori";

export function FinPage({
  finCashData,
  finBarData,
  year,
}: {
  finCashData: GetFinData | null;
  finBarData: GetFinData | null;
  year: string;
}) {
  const tab = useSearchParams().get("tab");
  return (
    <>
      {tab === "fin-nori" && <FinNori finCashData={finCashData} year={year} />}
      {tab === "fin-bar" && <FinBar finBarData={finBarData} year={year} />}
    </>
  );
}
