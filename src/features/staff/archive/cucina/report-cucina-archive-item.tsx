import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { classNameHead } from "@/features/staff/archive/bar/report-bar-archive-item";
import PreparedTable from "@/features/staff/archive/cucina/prepared-table";
import ShiftsTable from "@/features/staff/archive/cucina/shifts-table";
import StaffTable from "@/features/staff/archive/cucina/staff-table";
import WriteOffTable from "@/features/staff/archive/cucina/write-off-table";
import { GetKitchenData } from "@/features/staff/cucina/model/type";

export const classNameHeadCucina = "text-shadow-muted-foreground font-bold";

export const classNameRowBorderCucina = "border-b-bl";

export default function ReportCucinaArchiveItem({
  data,
  defaultOpen,
}: {
  data: GetKitchenData;
  defaultOpen?: boolean;
}) {
  const reportData = data.report;

  const prepared = [
    ...(reportData?.cutting?.filter((i) => i.product) ?? []),
    ...(reportData?.preparedFirst?.filter((i) => i.product) ?? []),
    ...(reportData?.preparedGarnish?.filter((i) => i.product) ?? []),
    ...(reportData?.preparedDesserts?.filter((i) => i.product) ?? []),
    ...(reportData?.preparedSalads?.filter((i) => i.product) ?? []),
    ...(reportData?.preparedSeconds?.filter((i) => i.product) ?? []),
  ];

  const preparedPersonal = [
    ...(reportData?.staffFurchet?.filter((i) => i.product) ?? []),
    ...(reportData?.staff?.filter((i) => i.product) ?? []),
  ];

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <Card className="bg-background! my-2 shadow-none md:m-2">
        <CollapsibleTrigger asChild>
          <CardTitle className="text-bl p-4 text-xs">day: {data.id}</CardTitle>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="grid grid-cols-1 gap-4 pb-4 xl:grid-cols-4">
            <ShiftsTable data={reportData?.shifts} />

            <WriteOffTable data={reportData?.writeOff} />

            <PreparedTable data={prepared} />

            <StaffTable data={preparedPersonal} />
          </CardContent>

          <CardFooter>
            <div className={classNameHead}>
              notes:
              <span className="text-rd px-4 text-xs">{reportData?.notes}</span>
            </div>
          </CardFooter>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
