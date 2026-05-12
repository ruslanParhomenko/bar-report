import { GetAoData } from "@/app/actions/a-o/ao-action";
import { GetCashData } from "@/app/actions/cash/cash-action";
import CashMonthPage from "./month/cash-month-page";
import CashYearPage from "./year/cash-year-page";

export default function CashPage({
  dataAo,
  dataCashYear,
  tab,
}: {
  dataAo: GetAoData | null;
  dataCashYear: GetCashData[] | null;
  tab: string;
}) {
  return (
    <>
      {tab === "cash-month" && (
        <CashMonthPage dataAo={dataAo} dataCashYear={dataCashYear} />
      )}

      {tab === "cash-year" && <CashYearPage data={dataCashYear} />}
    </>
  );
}
