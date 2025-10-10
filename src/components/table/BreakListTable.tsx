import { Row } from "@/generated/prisma";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DeleteListButton } from "../buttons/DeleteListButton";
import { BREAK_LIST_ENDPOINT } from "@/constants/endpoint-tag";
import { BreakListData } from "@/constants/type";

export default function BreakTable({
  data,
  invalidate,
}: {
  data: BreakListData;
  invalidate?: () => void;
}) {
  const filtered = data?.rows?.filter((row: Row) => row.name?.trim());

  if (!filtered?.length) return null;
  return (
    <Card className="shadow-md border rounded-2xl md:p-4 mb-4">
      <CardHeader>
        <CardTitle>
          <DeleteListButton
            data={data}
            nameTag={BREAK_LIST_ENDPOINT}
            invalidate={invalidate}
          />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableBody>
            {filtered.map((row: Row) => {
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
                  <TableCell className=" font-bold md:w-3xs">
                    {row.name ?? "-"}
                  </TableCell>
                  <TableCell className="text-sm text-gr font-bold md:w-xs">
                    {row.externalId}
                  </TableCell>
                  <TableCell className="w-2 border-l" />

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
      </CardContent>
    </Card>
  );
}
