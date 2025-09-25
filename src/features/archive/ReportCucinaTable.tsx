import { DeleteListButton } from "@/components/buttons/DeleteListButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { REPORT_CUCINA_ENDPOINT } from "@/constants/endpoint-tag";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import React from "react";

export default function ReportTable({ data }: { data: any }) {
  const isMobile = useIsMobile();

  const classTable = cn("md:w-100 table-fixed", {
    "border-x border-gray-200": !isMobile,
  });

  return (
    <>
      {data.map((report: any, index: number) => (
        <React.Fragment key={report.id || index}>
          <DeleteListButton data={report} nameTag={REPORT_CUCINA_ENDPOINT} />

          <div className="py-4 px-2 border border-gray-200 rounded-md md:p-4 grid grid-cols-1 mx:auto xl:grid-cols-[24%_24%_24%_24%] gap-4">
            {/* Employees */}
            <div className="flex flex-col gap-4">
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
                  {report.shifts?.map((shift: any) => (
                    <TableRow key={shift.id}>
                      <TableCell>{shift.employees}</TableCell>
                      <TableCell>{shift.time}</TableCell>
                      <TableCell>{shift.over}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Remains */}
              <Table className={classTable}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-blue-600 w-30">
                      Remains
                    </TableHead>
                    <TableHead className="text-blue-600 w-10">p.</TableHead>
                    <TableHead className="text-blue-600 w-10">w.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.remains?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.portions}</TableCell>
                      <TableCell>{item.weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Transfer + Write-off */}
            <div className="flex flex-col gap-4">
              <Table className={classTable}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-blue-600 w-30">
                      Transfer
                    </TableHead>
                    <TableHead className="text-blue-600 w-30"></TableHead>
                    <TableHead className="text-blue-600 w-10">w.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.movement?.map((item: any) => (
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
                  {report.writeOff?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-rd">{item.product}</TableCell>
                      <TableCell className="text-rd">{item.weight}</TableCell>
                      <TableCell>{item.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Prepared */}
            <div className="flex flex-col gap-4">
              <Table className={classTable}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-blue-600 w-30">
                      Prepared
                    </TableHead>
                    <TableHead className="text-blue-600 w-8">p.</TableHead>
                    <TableHead className="text-blue-600 w-8">w.</TableHead>
                    <TableHead className="text-blue-600 w-8">time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ...report.preparedSalads,
                    ...report.preparedSeconds,
                    ...report.preparedDesserts,
                    ...report.cutting,
                  ]
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

            {/* Staff */}
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
                  {report.staff?.map((item: any) => (
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

            {report?.notes && <p>Notes: {report.notes}</p>}
          </div>
        </React.Fragment>
      ))}
    </>
  );
}
