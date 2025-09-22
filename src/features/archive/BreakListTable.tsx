import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function BreakListTable({ data }: { data: any }) {
  return (
    <>
      <div className="w-full border overflow-auto border-gray-200 rounded-md p-1 mb-4">
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
                    <TableCell
                      className={cn(
                        hoursEntries.length === 7
                          ? "font-bold"
                          : "font-bold text-rd"
                      )}
                    >
                      = {hoursEntries.length}
                    </TableCell>
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
      <div className="p-4 border rounded-md shadow-md ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>name</TableCell>
              <TableCell>day hours</TableCell>
              <TableCell>night hours</TableCell>
              <TableCell>penality</TableCell>
              <TableCell>reason</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.remarks.map((remark: any) => {
              if (!remark.name) return;
              return (
                <TableRow key={remark.id}>
                  <TableCell>{remark.name || "-"}</TableCell>
                  <TableCell>{remark.dayHours || "-"}</TableCell>
                  <TableCell>{remark.nightHours || "-"}</TableCell>
                  <TableCell>{remark.penality || "-"}</TableCell>
                  <TableCell>{remark.reason || "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
