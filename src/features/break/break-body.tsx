import { useEmployees } from "@/providers/EmployeesProvider";
import { useTheme } from "next-themes";
import { Path, useFormContext } from "react-hook-form";
import { BreakFormData } from "./schema";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { MINUTES_SELECT, TIME_LABELS } from "./constant";
import { isCurrentCell } from "./utils";
import { Input } from "@/components/ui/input";
import SelectField from "@/components/inputs/SelectField";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const BAR_EMPLOYEES = ["waiters", "barmen"];
export default function BreakTableBody() {
  const { theme } = useTheme();
  const employees = useEmployees()
    .filter((emp) => BAR_EMPLOYEES.includes(emp.role))
    .map((e) => e.name);

  const { watch, setValue } = useFormContext<BreakFormData>();
  const dataRows = watch("rows") ?? [];

  return (
    <TableBody>
      {dataRows.map((row, rowIndex) => {
        const rowHasTrue = TIME_LABELS.some((time) =>
          isCurrentCell(time, row.hours[time])
        );

        return (
          <TableRow key={`${row.id}-${rowIndex}`}>
            <TableCell className="p-0">
              <Input
                value={row.id}
                disabled
                className={cn(
                  "p-0 border-0 shadow-none text-bl",
                  theme === "dark" ? "bg-background!" : ""
                )}
                readOnly
              />
            </TableCell>

            <TableCell className="sticky left-0 z-10 text-left p-0">
              <SelectField
                fieldName={`rows.${rowIndex}.name` as Path<BreakFormData>}
                data={employees}
                placeHolder="..."
                className={cn(
                  "border-0 shadow-none",
                  rowHasTrue ? "text-rd!" : ""
                )}
              />
            </TableCell>

            {TIME_LABELS.map((time, timeIndex) => {
              const value = row.hours[time];

              const isTrue = isCurrentCell(time, value);

              return (
                <TableCell key={timeIndex}>
                  <SelectField
                    fieldName={
                      `rows.${rowIndex}.hours.${time}` as Path<BreakFormData>
                    }
                    data={MINUTES_SELECT}
                    className={cn(
                      "justify-center",
                      isTrue ? "text-rd! font-bold text-[18px]" : "",
                      value === "X"
                        ? theme === "dark"
                          ? "text-background! border-0 bg-background!"
                          : "bg-gr"
                        : ""
                    )}
                  />
                </TableCell>
              );
            })}

            {row.name && (
              <TableCell
                className="p-0 cursor-pointer"
                onClick={() => setValue(`rows.${rowIndex}.name`, "")}
              >
                <Trash2 className="w-4 h-4 text-rd" />
              </TableCell>
            )}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
