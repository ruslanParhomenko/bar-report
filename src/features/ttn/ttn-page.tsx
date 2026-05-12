import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { GetTTNData } from "@/app/actions/ttn/ttn-actions";
import { MONTHS } from "@/utils/get-month-days";
import TTNDayPage from "./day/ttn-day-page";
import TtnMonthPage from "./month/ttn-month-page";
import TtnYearPage from "./year/ttn-year-page";

export default function TTNPage({
  dataTTN,
  agentTTN,
  tab,
  month,
  year,
}: {
  dataTTN: GetTTNData[] | null;
  agentTTN: CreateDataTTN;
  tab: string;
  month: string;
  year: string;
}) {
  const indexOfCurrentMonth = MONTHS.findIndex((m) => m === month);
  const prevMonth = month === "january" ? "" : MONTHS[indexOfCurrentMonth - 1];

  const dataTtn = dataTTN?.find((data) => data.id === month) || null;
  const dataTtnPrev = dataTTN?.find((data) => data.id === prevMonth) || null;

  return (
    <>
      {tab === "day" && (
        <TTNDayPage
          dataTtn={dataTtn}
          month={month as string}
          year={year as string}
        />
      )}

      {tab === "month" && (
        <TtnMonthPage
          dataTtn={dataTtn}
          dataTtnPrev={dataTtnPrev}
          agentTTN={agentTTN.agent}
        />
      )}

      {tab === "year" && (
        <TtnYearPage data={dataTTN} agentTTN={agentTTN.agent} />
      )}
    </>
  );
}
