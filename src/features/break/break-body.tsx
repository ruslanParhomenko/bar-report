import { useTheme } from "next-themes";
import { Path, useFormContext, useWatch } from "react-hook-form";
import { BreakFormData } from "./schema";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { MINUTES_SELECT, TIME_LABELS } from "./constant";
import { isCurrentCell } from "./utils";
import { Input } from "@/components/ui/input";
import SelectField from "@/components/inputs/SelectField";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useAbility } from "@/providers/AbilityProvider";

export default function BreakTableBody({
  employeesName,
}: {
  employeesName: string[];
}) {
  const { theme } = useTheme();

  const { isAdmin, isBar } = useAbility();
  const isDisabled = !isAdmin && !isBar;

  const form = useFormContext<BreakFormData>();

  const dataRows = useWatch({
    control: form.control,
    name: "rows",
  });

  return (
    <TableBody>
      {dataRows.map((row, rowIndex) => {
        const rowHasTrue = row.hours.some((value, index) => {
          const time = TIME_LABELS[index];
          return isCurrentCell(time, value);
        });

        return (
          <TableRow key={`${row.id}-${rowIndex}`}>
            <TableCell className="p-0">
              <Input
                value={row.id}
                disabled
                className={cn(
                  "p-0 border-0 shadow-none text-bl",
                  theme === "dark" ? "bg-background!" : "",
                )}
                readOnly
              />
            </TableCell>

            <TableCell className="sticky left-0 z-10 text-left p-0">
              <SelectField
                fieldName={`rows.${rowIndex}.name` as Path<BreakFormData>}
                data={employeesName}
                placeHolder="..."
                className={cn(
                  "border-0 shadow-none",
                  rowHasTrue ? "text-rd!" : "",
                )}
                disabled={isDisabled}
              />
            </TableCell>

            {TIME_LABELS.map((_time, timeIndex) => {
              const value = row.hours[timeIndex];
              const isTrue = isCurrentCell(TIME_LABELS[timeIndex], value);

              return (
                <TableCell key={timeIndex}>
                  <SelectField
                    fieldName={
                      `rows.${rowIndex}.hours.${timeIndex}` as Path<BreakFormData>
                    }
                    data={MINUTES_SELECT}
                    className={cn(
                      "justify-center",
                      isTrue ? "text-rd! font-bold text-[18px]" : "",
                      value === "X"
                        ? theme === "dark"
                          ? "text-background! border-0 bg-background!"
                          : "bg-gr text-gr"
                        : "",
                    )}
                    disabled={isDisabled}
                  />
                </TableCell>
              );
            })}

            {row.name && (
              <TableCell
                className="p-0 cursor-pointer"
                onClick={() => form.setValue(`rows.${rowIndex}.name`, "")}
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
