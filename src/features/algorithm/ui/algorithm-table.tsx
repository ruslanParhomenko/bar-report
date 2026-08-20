import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AlgorithmData } from "../model/schema";

export default function AlgorithmTable({
  data,
}: {
  data: AlgorithmData[keyof AlgorithmData] | undefined;
}) {
  return (
    <Table className="mt-4">
      <TableBody>
        {data?.map((item, idx) => {
          return (
            <TableRow key={`item-${idx}`}>
              <TableCell className="w-6 p-1.5">{idx + 1}</TableCell>

              <TableCell className="p-1">
                <span
                  className={cn(
                    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex w-full max-w-dvw rounded-md border bg-transparent p-1 shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                    "bg-background! min-h-1 resize-none border-0 text-xs! shadow-none",
                    "wrap-break-word whitespace-normal",
                    "leading-5",
                  )}
                >
                  {item.value}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
