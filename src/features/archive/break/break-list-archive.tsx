import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TIME_LABELS } from "@/features/break/model/constant";
import { GetBreakData } from "@/features/break/model/type";
import { Collapsible } from "@radix-ui/react-collapsible";

export function BreakListArchive({ data }: { data: GetBreakData[] | null }) {
  if (!data) return null;
  const sortedData = [...data].sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <>
      {sortedData.map((item, index) => {
        return (
          <Collapsible key={item.id} defaultOpen={index === 0}>
            <Card className="bg-background! my-2 cursor-pointer shadow-none md:m-2">
              <CollapsibleTrigger asChild>
                <CardTitle className="text-bl p-4 text-xs">
                  day: {item.id}
                </CardTitle>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="flex flex-col gap-4">
                  <Table>
                    <TableBody>
                      {item.rows.map((row, rowIndex) => {
                        return (
                          <TableRow
                            key={row.id + rowIndex}
                            className="hover:text-rd cursor-pointer"
                          >
                            <TableCell className="bg-background sticky left-0 py-1 md:w-30">
                              {row.name ?? "-"}
                            </TableCell>
                            <TableCell className="text-gr text-center text-xs">
                              {row.id}
                            </TableCell>

                            {TIME_LABELS.map((hour, indexHour) => {
                              const value = row.hours[indexHour];
                              const isView = ["00", "20", "40"].includes(value);
                              return (
                                <TableCell
                                  key={`${row.id}-${indexHour}`}
                                  className="text-bl text-center text-xs"
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
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </>
  );
}
