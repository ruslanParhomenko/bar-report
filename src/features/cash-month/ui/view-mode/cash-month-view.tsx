"use client";

import { Table } from "@/components/ui/table";
import type { GetCashData } from "@/features/cash-month/model/type";
import CashMonthHeader from "@/features/cash-month/ui/shared/cash-month-header";
import { CashMonthBodyView } from "@/features/cash-month/ui/view-mode/cash-body-view";
import CashFooterViews from "@/features/cash-month/ui/view-mode/cash-footer-view";
import { useState } from "react";

export default function CashMonthView({
  dataCashByMonth,
}: {
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
        selectedDay={selectedDay}
      />

      <CashFooterViews data={dataCashByMonth} />
    </Table>
  );
}
