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
        console.log("row", row);
        const totalBreak = row.hours.reduce(
          (acc, value) => acc + (["00", "20", "40"].includes(value) ? 1 : 0),
          0,
        );
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
                  "px-0.5 border-0 shadow-none text-bl text-xs",
                  // theme === "dark" ? "bg-background!" : "",
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
            <TableCell className="p-0 text-bl">
              {row.name && totalBreak}
            </TableCell>

            {TIME_LABELS.map((_time, timeIndex) => {
              const value = row.hours[timeIndex];
              const isTrue = isCurrentCell(TIME_LABELS[timeIndex], value);
              const isView = value !== "X";

              return (
                <TableCell key={timeIndex}>
                  {isView ? (
                    <SelectField
                      fieldName={
                        `rows.${rowIndex}.hours.${timeIndex}` as Path<BreakFormData>
                      }
                      data={MINUTES_SELECT}
                      className={cn(
                        "justify-center",
                        isTrue ? "text-rd! font-bold text-[18px]" : "",
                      )}
                      disabled={isDisabled}
                    />
                  ) : (
                    <div
                      className={cn(!isView && "bg-gr p-1 h-8 rounded-md")}
                    ></div>
                  )}
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
