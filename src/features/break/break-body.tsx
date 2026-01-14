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

  const { watch, getValues, reset } = useFormContext<BreakFormData>();
  const dataRows = watch("rows") ?? [];
  return (
    <TableBody>
      {dataRows?.map((row, rowIndex) => {
        const rowHasTrue = TIME_LABELS.some((time) =>
          isCurrentCell(
            time,
            watch(`rows.${rowIndex}.hours.${time}` as Path<BreakFormData>) as
              | string
              | string[]
          )
        );

        const nameValue = watch(`rows.${rowIndex}.name`);

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
                fieldName={`rows[${rowIndex}].name`}
                data={employees}
                placeHolder="..."
                className={cn(
                  "border-0 shadow-none",
                  rowHasTrue ? "text-rd!" : ""
                )}
              />
            </TableCell>

            {TIME_LABELS.map((time, timeIndex) => {
              const value = watch(
                `rows.${rowIndex}.hours.${time}` as Path<BreakFormData>
              );

              const isTrue = isCurrentCell(time, value as string | string[]);
              const selectedValue = Array.isArray(value) ? value[0] : value;

              return (
                <TableCell key={timeIndex}>
                  <SelectField
                    fieldName={`rows[${rowIndex}].hours.${time}`}
                    data={MINUTES_SELECT}
                    className={cn(
                      "justify-center",
                      isTrue ? "text-rd! font-bold text-[18px]" : "",
                      selectedValue === "X"
                        ? theme === "dark"
                          ? "text-background!  border-0 bg-background!"
                          : "bg-gr"
                        : ""
                    )}
                  />
                </TableCell>
              );
            })}

            {nameValue && (
              <TableCell
                className="p-0 cursor-pointer"
                onClick={() => {
                  const currentValues = getValues();
                  reset({
                    ...currentValues,
                    rows: currentValues.rows.map((r, i) =>
                      i === rowIndex ? { ...r, name: "" } : r
                    ),
                  });
                }}
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
