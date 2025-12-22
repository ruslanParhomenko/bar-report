import { REPORT_CUCINA_ENDPOINT } from "@/constants/endpoint-tag";
import { DeleteListButton } from "@/features/archive/DeleteListButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ShiftsTable from "./ShiftsTable";
import RemainsTable from "./RemainsTable";
import MovementTable from "./MovementTable";
import WriteOffTable from "./WriteOffTable";
import PreparedTable from "./PreparedTable";
import StaffTable from "./StaffTable";
import NotesTable from "../NotesTable";
import { ReportCucinaData } from "@/app/actions/archive/reportCucinaAction";

export const classNameHeadCucina = "text-shadow-muted-foreground font-bold";
export const classNameRowBorderCucina = "border-b-bl";

export default function ReportCucinaTable({
  data,
}: {
  data: ReportCucinaData;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <DeleteListButton data={data} nameTag={REPORT_CUCINA_ENDPOINT} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 xl:grid-cols-4 gap-4 ">
        <div>
          <ShiftsTable data={data.shifts} />
          <RemainsTable data={data.remains} />
          <MovementTable data={data.movement} />
        </div>
        <WriteOffTable data={data.writeOff} />
        <PreparedTable data={data.prepared} />
        <StaffTable data={data.staff} />
      </CardContent>
      <CardFooter>
        <NotesTable data={data.notes as string} />
      </CardFooter>
    </Card>
  );
}
