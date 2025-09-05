import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function BreakListTable({ data }: { data: any }) {
  console.log("BreakListTable data:", data);
  return (
    <>
      <div className="w-full border overflow-auto border-gray-200 rounded-md p-1">
        {data && (
          <Table>
            <TableBody>
              {data?.rows?.map((row: any) => {
                const hoursEntries = Object.entries(row)
                  .filter(([key]) => key.startsWith("h_"))
                  .map(([key, value]) => ({
                    hour: key.substring(2),
                    value: value as string,
                  }))
                  .filter(({ value }) => value && value !== "X");

                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.externalId}</TableCell>
                    <TableCell>{row.name ?? "-"}</TableCell>
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
        )}
      </div>
    </>
  );
}
