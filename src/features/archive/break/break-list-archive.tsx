import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BreakGetType } from "@/app/actions/break/break-action";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TIME_LABELS } from "@/features/bar/break-form/constant";

export function BreakListArchive({ data }: { data: BreakGetType | null }) {
  return (
    <>
      {data &&
        data?.data.map((data, index) => {
          return (
            <Card key={index} className="bg-background! shadow-none m-2">
              <CardTitle className="text-xs text-bl">day: {data.day}</CardTitle>
              <CardContent className="flex flex-col gap-4">
                <Table>
                  <TableBody>
                    {data.rows.map((row, rowIndex) => {
                      return (
                        <TableRow
                          key={row.id + rowIndex}
                          className="hover:text-rd  cursor-pointer"
                        >
                          <TableCell className="py-1 md:w-30 sticky left-0 bg-background">
                            {row.name ?? "-"}
                          </TableCell>
                          <TableCell className="text-xs text-gr text-center">
                            {row.id}
                          </TableCell>

                          {TIME_LABELS.map((hour, indexHour) => {
                            const value = row.hours[indexHour];
                            const isView = ["00", "20", "40"].includes(value);
                            return (
                              <TableCell
                                key={`${row.id}-${indexHour}`}
                                className="text-center text-bl text-xs"
                              >
                                {isView && `${hour}:${value}`}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
    </>
  );
}
