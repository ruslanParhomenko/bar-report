import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { REPORT_CUCINA_ENDPOINT } from "@/constants/endpoint-tag";
import { DeleteListButton } from "../buttons/DeleteListButton";

export default function ReportCucinaTable({
  data,
  invalidate,
}: {
  data: any;
  invalidate?: () => void;
}) {
  console.log("data table", data);
  const isMobile = useIsMobile();
  const classTable = cn("md:w-100 table-fixed", {
    "border-x border-gray-200": !isMobile,
  });
  const prepared = [
    ...(data?.preparedSalads || []),
    ...(data?.preparedSeconds || []),
    ...(data?.preparedDesserts || []),
    ...(data?.cutting || []),
  ];
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
      <CardContent className="flex flex-col md:flex-row gap-2">
        <div className="flex flex-col gap-4">
          {data?.shifts && (
            <Table className={classTable}>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-600 w-30">
                    Employees
                  </TableHead>
                  <TableHead className="text-blue-600 w-10">Time</TableHead>
                  <TableHead className="text-blue-600 w-10">Over</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.shifts?.map((shift: any) => (
                  <TableRow key={shift.id}>
                    <TableCell>{shift.employees}</TableCell>
                    <TableCell>{shift.time}</TableCell>
                    <TableCell>{shift.over}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {data.remains && (
            <Table className={classTable}>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-600 w-30">Remains</TableHead>
                  <TableHead className="text-blue-600 w-10">p.</TableHead>
                  <TableHead className="text-blue-600 w-10">w.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.remains?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.portions}</TableCell>
                    <TableCell>{item.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {data.movement && (
            <Table className={classTable}>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-600 w-30">Transfer</TableHead>
                  <TableHead className="text-blue-600 w-30"></TableHead>
                  <TableHead className="text-blue-600 w-10">w.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.movement?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="truncate">
                      {item.nameOutside}
                    </TableCell>
                    <TableCell className="truncate">
                      {item.nameInside}
                    </TableCell>
                    <TableCell>{item.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {data.writeOff && (
            <Table className={classTable}>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-600 w-30">
                    Write-off
                  </TableHead>
                  <TableHead className="text-blue-600 w-10">w.</TableHead>
                  <TableHead className="text-blue-600 w-10">reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.writeOff?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-rd">{item.product}</TableCell>
                    <TableCell className="text-rd">{item.weight}</TableCell>
                    <TableCell>{item.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Prepared */}
        {prepared.length > 0 && (
          <div className="flex flex-col gap-4">
            <Table className={classTable}>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-600 w-30">Prepared</TableHead>
                  <TableHead className="text-blue-600 w-8">p.</TableHead>
                  <TableHead className="text-blue-600 w-8">w.</TableHead>
                  <TableHead className="text-blue-600 w-8">time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prepared
                  ?.filter((item) => item.product)
                  .map((item: any, index: number) => (
                    <TableRow key={`${item.id}-${index}`}>
                      <TableCell className="truncate font-bold">
                        {item.product || "-"}
                      </TableCell>
                      <TableCell className="font-bold">
                        {item.portions || "-"}
                      </TableCell>
                      <TableCell>{item.weight || "-"}</TableCell>
                      <TableCell>{item.time}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Staff */}
        {data?.staff && (
          <div className="flex flex-col gap-4">
            <Table className={classTable}>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-600 w-30">Staff</TableHead>
                  <TableHead className="text-blue-600 w-8">p.</TableHead>
                  <TableHead className="text-blue-600 w-8">w.</TableHead>
                  <TableHead className="text-blue-600 w-8">time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.staff?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="truncate">{item.product}</TableCell>
                    <TableCell>{item.portions || "-"}</TableCell>
                    <TableCell>{item.weight || "-"}</TableCell>
                    <TableCell>{item?.time || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {data?.notes && <p className="p-4">Notes: {data.notes}</p>}
    </Card>
  );
}
