import { GetTipsData } from "@/app/actions/tips/tips-action";
import TipsMonthPage from "./month/tips-month-page";
import TipsYearPage from "./year/tips-year-page";

export default function TipsPage({
  dataTipsYear,
  tab,
}: {
  dataTipsYear: GetTipsData[] | null;
  tab: string;
}) {
  return (
    <>
      {tab === "tips-month" && <TipsMonthPage dataTipsYear={dataTipsYear} />}
      {tab === "tips-year" && <TipsYearPage dataTipsYear={dataTipsYear} />}
    </>
  );
}
