"use client";

import { Table } from "@/components/ui/table";
import type { GetCashData } from "@/features/cash-month/model/type";
import { CashYearBody } from "@/features/cash-year/ui/cash-year-body";
import { CashYearHeader } from "@/features/cash-year/ui/cash-year-header";

export default function CashYearPage({ data }: { data: GetCashData[] | null }) {
  return (
    <Table className="mt-4 table-auto">
      <CashYearHeader />
      <CashYearBody data={data} />
    </Table>
  );
}
