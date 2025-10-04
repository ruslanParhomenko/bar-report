import { Row } from "@/generated/prisma";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

export default function BreakTable({ data }: { data: Row[] }) {
  const filtered = data?.filter((row) => row.name?.trim());

  if (!filtered?.length) return null;
  return (
    <div className="p-4 border rounded-md shadow-xs mb-4">
      <Table>
        <TableBody>
          {filtered.map((row) => {
            const hoursEntries = Object.entries(row)
              .filter(([key]) => key.startsWith("h_"))
              .map(([key, value]) => ({
                hour: key.substring(2),
                value: value as string,
              }))
              .filter(({ value }) => value && value !== "X");

            return (
              <TableRow key={row.id} className="hover:text-rd  cursor-pointer">
                <TableCell className=" font-bold md:w-3xs">
                  {row.name ?? "-"}
                </TableCell>
                <TableCell className="text-sm text-gr font-bold md:w-xs">
                  {row.externalId}
                </TableCell>
                <TableCell className="w-2 border-l" />

                {hoursEntries.map(({ hour, value }) => (
                  <TableCell key={`${row.id}-${hour}`} className="text-center">
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
}
