"use client";

import CashMonthEdit from "@/features/cash-month/ui/edit-mode/cash-month-edit";
import CashMonthView from "@/features/cash-month/ui/view-mode/cash-month-view";

import type { GetAoData } from "@/features/finance/a-o/model/type";
import type { GetCashData } from "@/features/finance/cash/model/type";

import { useEdit } from "@/providers/edit-provider";

export default function CashMonthPage({
  dataAo,
  dataCashByMonth,
}: {
  dataAo: GetAoData | null;
  dataCashByMonth: GetCashData | null;
}) {
  const { isEdit } = useEdit();

  if (isEdit) {
    return (
      <CashMonthEdit dataAoByMonth={dataAo} dataCashByMonth={dataCashByMonth} />
    );
  }

  return (
    <CashMonthView dataAoByMonth={dataAo} dataCashByMonth={dataCashByMonth} />
  );
}
