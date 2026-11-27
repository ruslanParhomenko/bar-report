import type { GetCashData } from "@/features/cash-month/model/type";
import CashRowView from "@/features/cash-month/ui/view-mode/cash-row-view";

export type CashSection =
  "1c" | "cash" | "visa" | "visa-terminal" | "nbm" | "coll";
export type CashItem = {
  key: string;
  label: string;
  colorText: string;
  section: CashSection;
};

export function CashMonthBodyView({
  dataCashByMonth,
  selectedDay,
}: {
  dataCashByMonth: GetCashData | null;
  selectedDay?: number;
}) {
  const dataCash = dataCashByMonth?.cashData;

  return (
    <>
      <CashRowView
        rowsSection={"1c"}
        dataCash={dataCash}
        selectedDay={selectedDay}
        diffRowSection={"cash"}
        withTotalByDay={false}
        withTotal={false}
      />
      <CashRowView
        rowsSection={"cash"}
        dataCash={dataCash}
        selectedDay={selectedDay}
      />
      <CashRowView
        rowsSection={"visa"}
        dataCash={dataCash}
        selectedDay={selectedDay}
      />
      <CashRowView
        rowsSection={"visa-terminal"}
        dataCash={dataCash}
        selectedDay={selectedDay}
        diffRowSection={"visa"}
        withTotalByDay={false}
        withTotal={false}
      />
      <CashRowView
        rowsSection={"coll"}
        dataCash={dataCash}
        selectedDay={selectedDay}
      />
      <CashRowView
        rowsSection={"nbm"}
        dataCash={dataCash}
        selectedDay={selectedDay}
        withTotal={false}
        withTotalByDay={false}
      />
    </>
  );
}
