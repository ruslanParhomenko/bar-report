"use client";

import { Table } from "@/components/ui/table";
import CashMonthHeader from "@/features/cash-month/ui/shared/cash-month-header";
import { CashMonthBodyView } from "@/features/cash-month/ui/view-mode/cash-body-view";
import CashFooterViews from "@/features/cash-month/ui/view-mode/cash-footer-view";
import { GetAoData } from "@/features/finance/a-o/model/type";
import { ROW_CASH_DATA } from "@/features/finance/cash/model/constants";
import type { GetCashData } from "@/features/finance/cash/model/type";
import { useState } from "react";

export default function CashMonthView({
  dataAoByMonth,
  dataCashByMonth,
}: {
  dataAoByMonth: GetAoData | null;
  dataCashByMonth: GetCashData | null;
}) {
  const todayDay = new Date().getDate();

  const [selectedDay, setSelectedDay] = useState<number>(todayDay);

  return (
    <Table className="mt-4 table-auto">
      <CashMonthHeader
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />

      <CashMonthBodyView
        dataCashByMonth={dataCashByMonth}
        data={ROW_CASH_DATA}
        selectedDay={selectedDay}
      />

      <CashFooterViews data={dataCashByMonth} />
    </Table>
  );
}
