import SelectField from "@/components/input-controlled/select-field";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Path, useFormContext, useWatch } from "react-hook-form";
import { BarFormValues } from "../schema";
import { MINUTES_SELECT, TIME_LABELS } from "./constant";
import { BreakFormData } from "./schema";
import { isCurrentCell } from "./utils";

export default function BreakTableBody({
  employeesName,
  isDisabled,
}: {
  employeesName: { name: string; id: string }[];
  isDisabled: boolean;
}) {
  const { control, setValue } = useFormContext<BarFormValues>();

  const values = useWatch({
    control,
    name: "breakForm.rows",
  });

  return (
    <TableBody>
      {values?.map((row, rowIndex) => {
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
            <TableCell className="p-0 text-bl border-0 bg-transparent! px-0.5 text-xs shadow-none">
              {row.id}
            </TableCell>

            <TableCell className="bg-background sticky left-0 z-10 py-0 text-left">
              <SelectField
                fieldName={
                  `breakForm.rows.${rowIndex}.name` as Path<BreakFormData>
                }
                data={employeesName.map((e) => e.name)}
                placeHolder="..."
                className={cn(
                  "w-full border-0 bg-transparent! shadow-none",
                  rowHasTrue ? "text-rd!" : "",
                )}
                disabled={isDisabled}
              />
            </TableCell>
            <TableCell className="text-bl p-0">
              {row.name && totalBreak}
            </TableCell>

            {TIME_LABELS.map((_time, timeIndex) => {
              const value = row.hours[timeIndex];
              const isTrue = isCurrentCell(TIME_LABELS[timeIndex], value);
              const isView = value !== "X";

              return (
                <TableCell key={timeIndex} className="p-0">
                  {isView ? (
                    <SelectField
                      fieldName={
                        `breakForm.rows.${rowIndex}.hours.${timeIndex}` as Path<BreakFormData>
                      }
                      data={MINUTES_SELECT}
                      className={cn(
                        "h-6! w-11 justify-center border-0 shadow-none",
                        isTrue ? "text-rd! font-bold" : "",
                      )}
                      disabled={isDisabled}
                    />
                  ) : (
                    <div className={cn("bg-gr h-6 w-11 rounded-md")}></div>
                  )}
                </TableCell>
              );
            })}

            {row.name && (
              <TableCell
                className="cursor-pointer p-0"
                onClick={() =>
                  !isDisabled &&
                  setValue(`breakForm.rows.${rowIndex}.name`, "", {
                    shouldDirty: true,
                  })
                }
              >
                <Trash2 className="text-rd h-3 w-3" />
              </TableCell>
            )}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
