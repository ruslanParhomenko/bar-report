import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import ShiftsTable from "./ShiftsTable";
import RemainsTable from "./RemainsTable";
import WriteOffTable from "./WriteOffTable";
import PreparedTable from "./PreparedTable";
import StaffTable from "./StaffTable";
import { classNameHead } from "../report-bar-table/ReportBarTable";
import { ReportDataByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";

export const classNameHeadCucina = "text-shadow-muted-foreground font-bold";
export const classNameRowBorderCucina = "border-b-bl";

export default function ReportCucinaTable({
  data,
}: {
  data: ReportDataByUniqueKey | null;
}) {
  return (
    <>
      {data &&
        data?.data.map((item, index) => {
          const reportData = item.report;
          const prepared = [
            ...(reportData?.cutting?.filter((item) => item.product) || []),
            ...(reportData?.preparedDesserts?.filter((item) => item.product) ||
              []),
            ...(reportData?.preparedSalads?.filter((item) => item.product) ||
              []),
            ...(reportData?.preparedSeconds?.filter((item) => item.product) ||
              []),
          ];
          return (
            <Card key={index} className="bg-background! shadow-none m-2">
              <CardTitle className="text-xs text-bl">day: {item.day}</CardTitle>
              <CardContent className="grid grid-cols-1 xl:grid-cols-4 gap-4 ">
                <div>
                  <ShiftsTable data={reportData?.shifts} />
                  <RemainsTable data={reportData?.remains} />
                </div>
                <WriteOffTable data={reportData?.writeOff} />
                <PreparedTable data={prepared} />
                <StaffTable data={reportData?.staff} />
              </CardContent>
              <CardFooter>
                <div className={classNameHead}>
                  notes:{" "}
                  <span className="text-rd text-xs px-4">
                    {reportData?.notes}
                  </span>
                </div>
              </CardFooter>
            </Card>
          );
        })}
    </>
  );
}
