import { BreakListData } from "@/constants/type";
import { DeleteListButton } from "../archive/DeleteListButton";
import { Separator } from "@/components/ui/separator";
import { BREAK_LIST_ENDPOINT } from "@/constants/endpoint-tag";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Row } from "@/generated/prisma";

export function BreakTableByData({ data }: { data: BreakListData[] }) {
  return (
    <div className="h-[90vh] overflow-auto">
      {data?.length > 0 &&
        data.map((data, index) => {
          return (
            <div key={index}>
              <DeleteListButton data={data} nameTag={BREAK_LIST_ENDPOINT} />
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
                        <TableCell className="font-bold md:w-3xs sticky left-0 bg-card">
                          {row.name ?? "-"}
                        </TableCell>
                        <TableCell className="text-sm text-gr  md:w-xs">
                          {row.externalId}
                        </TableCell>
                        <TableCell className="text-center">
                          {hoursEntries.length}
                        </TableCell>
                        <TableCell className="text-center">...</TableCell>

                        {hoursEntries.map(({ hour, value }) => (
                          <TableCell
                            key={`${row.id}-${hour}`}
                            className="text-center"
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
