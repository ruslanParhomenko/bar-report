import { TableBody } from "@/components/ui/table";
import CashYearRow from "@/features/cash-year/ui/cash-year-row";
import { GetCashData } from "../../cash-month/model/type";

export function CashYearBody({ data }: { data: GetCashData[] | null }) {
  if (!data) return null;
  return (
    <TableBody>
      <CashYearRow rowsSection={"1c"} data={data} />
      <CashYearRow rowsSection={"cash"} data={data} />
      <CashYearRow rowsSection={"visa"} data={data} />
      <CashYearRow rowsSection={"coll"} data={data} />
      <CashYearRow
        rowsSection={"nbm"}
        data={data}
        withTotal={false}
        withTotalByDay={false}
      />
    </TableBody>
  );
}
