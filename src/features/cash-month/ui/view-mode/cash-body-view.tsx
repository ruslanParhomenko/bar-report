import { TableBody } from "@/components/ui/table";
import CashRowView from "@/features/cash-month/ui/view-mode/cash-row-view";
import type { GetCashData } from "@/features/finance/cash/model/type";
import { useMonthDays } from "@/hooks/use-month-days";

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
  data,
  selectedDay,
}: {
  dataCashByMonth: GetCashData | null;
  data: CashItem[];
  selectedDay?: number;
}) {
  const { monthDays } = useMonthDays();

  const dataCash = dataCashByMonth?.cashData;

  return (
    <TableBody>
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

        withTotalByDay={false}
      />
      <CashRowView
        rowsSection={"nbm"}
        dataCash={dataCash}
        selectedDay={selectedDay}
        withTotal={false}
        withTotalByDay={false}
      />
    </TableBody>
  );
}
