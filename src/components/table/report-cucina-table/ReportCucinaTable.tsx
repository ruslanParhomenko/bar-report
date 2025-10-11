import { REPORT_CUCINA_ENDPOINT } from "@/constants/endpoint-tag";
import { DeleteListButton } from "@/components/buttons/DeleteListButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportCucinaData } from "@/constants/type";
import ShiftsTable from "./ShiftsTable";
import RemainsTable from "./RemainsTable";
import MovementTable from "./MovementTable";
import WriteOffTable from "./WriteOffTable";
import PreparedTable from "./PreparedTable";
import StaffTable from "./StaffTable";
import NotesTable from "./NotesTable";
import { vi } from "date-fns/locale";

export const classNameHeadCucina = "text-shadow-muted-foreground font-bold";
export const classNameRowBorderCucina = "border-b-bl";

export default function ReportCucinaTable({
  data,
  invalidate,
}: {
  data: ReportCucinaData;
  invalidate?: () => void;
}) {
  const visibleTables = [
    data.shifts,
    data.writeOff,
    data.prepared,
    data.staff,
    data.remains,
    data.movement,
    data.notes,
  ].filter(Boolean).length;

  const gridCols = visibleTables === 1 ? "md:grid-cols-1" : "md:grid-cols-4";
  const gridColsFooter =
    visibleTables === 1 ? "md:grid-cols-1" : "md:grid-cols-[30%_70%]";
  return (
    <Card className="shadow-md border rounded-2xl md:p-4 mb-4">
      <CardHeader>
        <CardTitle>
          <DeleteListButton
            data={data}
            nameTag={REPORT_CUCINA_ENDPOINT}
            invalidate={invalidate}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className={`gap-6 grid grid-cols-1 ${gridCols}`}>
        <div>
          <ShiftsTable data={data.shifts} />
          <RemainsTable data={data.remains} />
        </div>
        <WriteOffTable data={data.writeOff} />
        <PreparedTable data={data.prepared} />
        <StaffTable data={data.staff} />
      </CardContent>
      <CardFooter className={`grid grid-cols-1 ${gridColsFooter} gap-6`}>
        <MovementTable data={data.movement} />

        <NotesTable data={data.notes as string} />
      </CardFooter>
    </Card>
  );
}
