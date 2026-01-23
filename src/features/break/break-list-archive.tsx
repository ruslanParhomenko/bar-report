import { DeleteListButton } from "../archive/DeleteListButton";
import { Separator } from "@/components/ui/separator";
import { BREAK_MAIN_ROUTE } from "@/constants/endpoint-tag";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BreakList, Row } from "@/prisma/generated/prisma/client";

type BreakListData = BreakList & { rows: Row[] };

export function BreakListArchive({ data }: { data: BreakListData[] }) {
  return (
    <div className="h-[90vh] overflow-auto">
      {data?.length > 0 &&
        data.map((data, index) => {
          return (
            <div key={index}>
              <DeleteListButton data={data} nameTag={BREAK_MAIN_ROUTE} />
              <Separator className="my-1 bg-bl" />
              <Table>
                <TableBody>
                  {data.rows.map((row: Row) => {
                    const hoursEntries = Object.entries(row)
                      .filter(([key]) => key.startsWith("h_"))
                      .map(([key, value]) => ({
                        hour: key.substring(2),
                        value: value as string,
                      }))
                      .filter(({ value }) => value && value !== "X");

                    return (
                      <TableRow
                        key={row.id}
                        className="hover:text-rd  cursor-pointer"
                      >
                        <TableCell className="py-1 md:w-3xs sticky left-0 bg-background">
                          {row.name ?? "-"}
                        </TableCell>
                        <TableCell className="text-sm text-gr  md:w-xs py-1">
                          {row.externalId}
                        </TableCell>
                        <TableCell className="text-center py-1">
                          {hoursEntries.length}
                        </TableCell>
                        <TableCell className="text-center py-1">...</TableCell>

                        {hoursEntries.map(({ hour, value }) => (
                          <TableCell
                            key={`${row.id}-${hour}`}
                            className="text-center py-1"
                          >
                            {hour}:{value}
                          </TableCell>
                        ))}
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
