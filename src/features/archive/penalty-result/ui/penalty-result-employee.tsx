import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function PenaltyResultEmployee({
  data,
  selectedEmployee,
  setSelectedEmployee,
}: {
  data: any;
  selectedEmployee: string;
  setSelectedEmployee: (employee: string) => void;
}) {
  const sorted = [...data].sort((a, b) => Number(b.id) - Number(a.id));

  const filteredRows =
    sorted.flatMap((doc) =>
      doc.remarks
        ?.filter((r: any) => r.name?.trim() === selectedEmployee)
        .map((r: any) => ({
          ...r,
          day: doc.id,
        })),
    ) ?? [];
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      className={cn(
        "absolute left-0 z-50 w-full py-1 md:w-[50dvw] md:px-2",
        "bg-border border shadow-lg",
        "rounded-md",
      )}
    >
      <div className="border-bl flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-semibold">{selectedEmployee}</span>

        <button
          type="button"
          onClick={() => setSelectedEmployee("")}
          className="text-rd hover:text-foreground md:px-2"
          aria-label="Закрыть карточку"
        >
          ✕
        </button>
      </div>

      <div className="max-h-[60dvh] overflow-y-auto">
        {filteredRows.length > 0 ? (
          <Table className="table-fixed">
            <TableBody>
              {filteredRows.map((fRow, fIndex) => (
                <TableRow
                  key={`${fRow.day}-${fIndex}`}
                  className="[&>td]:py-1 [&>td]:text-xs"
                >
                  <TableCell className="w-6 md:w-12">{fRow.day}.</TableCell>

                  <TableCell className="whitespace-normal">
                    {fRow.reason}
                  </TableCell>

                  <TableCell className="w-6 md:w-12">{fRow.dayHours}</TableCell>

                  <TableCell className="w-6 md:w-12">
                    {fRow.nightHours}
                  </TableCell>

                  <TableCell className="w-10 text-center md:w-14">
                    {fRow.bonus ? `+ ${fRow.bonus}` : ""}
                  </TableCell>

                  <TableCell className="w-10 text-center md:w-14">
                    {fRow.penalty ? `- ${fRow.penalty}` : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground px-3 py-4 text-sm">
            Нет замечаний
          </p>
        )}
      </div>
    </div>
  );
}
