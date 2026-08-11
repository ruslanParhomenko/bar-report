import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getAllAgentData } from "../lib/utils";

export default function TtnModaBodyTable({
  data,
}: {
  data: ReturnType<typeof getAllAgentData>;
}) {
  return (
    <TableBody>
      {data.map(
        ({ agent, agentMonthData, totalMinus, totalPlus, finalBalance }) => (
          <TableRow key={agent} className="group hover:bg-gray-300 [&>td]:py-0">
            <TableCell className="px-1 group-hover:font-bold">
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <span
                  className={cn(
                    "text-rd",
                    totalMinus === 0 && "text-muted-foreground",
                  )}
                >
                  {totalMinus?.toFixed(2)}
                </span>
                <span
                  className={cn(
                    "text-bl",
                    totalPlus === 0 && "text-muted-foreground",
                  )}
                >
                  {totalPlus?.toFixed(2)}
                </span>
              </div>
            </TableCell>

            <TableCell
              className={cn(
                "bg-background sticky left-0 border-x text-[11.5px] font-medium group-hover:font-bold group-hover:text-green-600 md:bg-transparent",
              )}
            >
              {agent}
            </TableCell>

            <TableCell
              className={cn(
                finalBalance < 0 ? "text-rd" : "text-bl",
                "w-16 border-x text-right text-[11px] font-bold",
              )}
            >
              {finalBalance?.toFixed(2)}
            </TableCell>

            {agentMonthData?.map(({ month, minus, plus }) => (
              <TableCell
                key={month}
                className="w-24 border-l group-hover:font-bold"
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={cn(
                      "text-rd text-[11px]",
                      minus === 0 && "opacity-0",
                    )}
                  >
                    {minus !== 0 ? minus.toFixed(2) : ""}
                  </span>
                  <span
                    className={cn(
                      "text-bl text-[11px]",
                      plus === 0 && "opacity-0",
                    )}
                  >
                    {plus !== 0 ? plus.toFixed(2) : ""}
                  </span>
                </div>
              </TableCell>
            ))}
          </TableRow>
        ),
      )}
    </TableBody>
  );
}
