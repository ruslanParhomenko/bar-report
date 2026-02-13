import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import RemainsTable from "./remains-table";
import WriteOffTable from "./write-off-table";
import PreparedTable from "./prepared-table";
import { classNameHead } from "../bar/report-bar";
import { ReportCucinaDataByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
import ShiftsTable from "./shifts-table";
import StaffTable from "./staff-table";

export const classNameHeadCucina = "text-shadow-muted-foreground font-bold";
export const classNameRowBorderCucina = "border-b-bl";

export default function ReportCucinaTable({
  data,
}: {
  data: ReportCucinaDataByUniqueKey | null;
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
