import SelectField from "@/components/input-controlled/select-field";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { MINUTES_SELECT, TIME_LABELS } from "./constant";

import { BarForm } from "../schema";
import { isCurrentCell } from "./utils";

export default function BreakTableBody({
  employeesName,
  isDisabled,
}: {
  employeesName: { name: string; id: string }[];
  isDisabled: boolean;
}) {
  const { control, setValue, getValues } = useFormContext<BarForm>();

  const values = useWatch({
    control,
    name: "breakForm.rows",
    defaultValue: [],
  });

  return (
    <TableBody>
      {values?.map((row, rowIndex) => {
        const totalBreak =
          Array.isArray(row.hours) &&
          row.hours?.reduce(
            (acc, value) => acc + (["00", "20", "40"].includes(value) ? 1 : 0),
            0,
          );
        const rowHasTrue =
          Array.isArray(row.hours) &&
          row.hours.some((value, index) => {
            const time = TIME_LABELS[index];
            return isCurrentCell(time, value);
          });

        return (
          <TableRow key={`${row.id ?? "row"}-${rowIndex}-${row.name}`}>
            <TableCell className="text-bl border-0 bg-transparent! p-0 px-0.5 text-xs shadow-none md:px-1">
              {row.isAdded ? (
                <button
                  type="button"
                  disabled={isDisabled}
                  className="hover:bg-muted mr-0.5 flex h-4 w-4 items-center justify-center rounded-sm border leading-none disabled:opacity-50"
                  onClick={() => {
                    const rows = getValues("breakForm.rows");
                    const updatedRows = rows.filter((_, i) => i !== rowIndex);
                    setValue("breakForm.rows", updatedRows, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  <Minus size={12} strokeWidth={1.5} className="text-rd" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isDisabled}
                  className="hover:bg-muted mr-0.5 flex h-4 w-4 cursor-pointer items-center justify-center border-0 text-xs leading-none disabled:opacity-50"
                  onClick={() => {
                    const rows = getValues("breakForm.rows");
                    const currentRow = rows[rowIndex];
                    const newRow = {
                      ...currentRow,
                      isAdded: true,
                      name: "",
                      hours: currentRow.hours.map(() => "" as const),
                    };
                    const updatedRows = [
                      ...rows.slice(0, rowIndex + 1),
                      newRow,
                      ...rows.slice(rowIndex + 1),
                    ];
                    setValue("breakForm.rows", updatedRows, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  <Plus size={12} strokeWidth={1.5} />
                </button>
              )}
            </TableCell>
            <TableCell className="text-bl border-0 bg-transparent! p-0 text-center text-xs shadow-none md:px-0.5 md:text-sm">
              {row.id}
            </TableCell>

            <TableCell className="bg-background sticky left-0 z-10 py-0.5 text-left">
              <SelectField
                fieldName={`breakForm.rows.${rowIndex}.name`}
                data={employeesName.map((e) => e.name)}
                placeHolder="..."
                className={cn(
                  "w-18 border-0 bg-transparent! px-0 text-xs shadow-none md:w-full md:px-1 md:text-sm",
                  rowHasTrue ? "text-rd!" : "",
                )}
                disabled={isDisabled}
              />
            </TableCell>
            <TableCell className="text-bl text-xs">
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
                      fieldName={`breakForm.rows.${rowIndex}.hours.${timeIndex}`}
                      data={MINUTES_SELECT}
                      className={cn(
                        "h-6! w-6! justify-center border-0 px-0 text-xs shadow-none md:w-11 md:text-sm",
                        isTrue ? "text-rd! font-bold" : "",
                      )}
                      disabled={isDisabled}
                    />
                  ) : (
                    <div
                      className={cn("bg-gr h-6 w-6 rounded-md md:w-11")}
                    ></div>
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
                    shouldTouch: true,
                    shouldValidate: true,
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
