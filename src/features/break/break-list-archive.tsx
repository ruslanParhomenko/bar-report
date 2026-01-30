import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BreakGetType } from "@/app/actions/break/break-action";
import { TIME_LABELS } from "./constant";

export function BreakListArchive({ data }: { data: BreakGetType }) {
  return (
    <div className="h-[90vh] overflow-auto">
      {data?.data?.length > 0 &&
        data?.data.map((data, index) => {
          return (
            <div key={index}>
              <Separator className="my-1 bg-bl" />
              <Table>
                <TableBody>
                  {data.rows.map((row, rowIndex) => {
                    return (
                      <TableRow
                        key={row.id + rowIndex}
                        className="hover:text-rd  cursor-pointer"
                      >
                        <TableCell className="py-1 md:w-8 text-xs text-rd">
                          {data.day}
                        </TableCell>
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
            </div>
          );
        })}
    </div>
  );
}
