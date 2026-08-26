import SelectField from "@/components/input-controlled/select-field";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { BarForm } from "../../bar/model/schema";
import { isCurrentCell } from "../lib/utils";
import { MINUTES_SELECT, TIME_LABELS } from "../model/constant";

export default function BreakTableBody({
  employeesName,
}: {
  employeesName: { name: string; id: string }[];
}) {
  const { control, setValue, getValues } = useFormContext<BarForm>();

  const values = useWatch({
    control,
    name: "breakForm.rows",
    defaultValue: [],
  });

  console.log(values);

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

        const startTime = +row.id.split("-")[0];

        return (
          <TableRow key={`${row.id ?? "row"}-${rowIndex}-${row.name}`}>
            <TableCell className="text-bl border-0 bg-transparent! p-0 px-0.5 text-xs shadow-none md:px-1">
              {row.isAdded ? (
                <button
                  type="button"
                  className="hover:bg-muted mr-0.5 flex h-4 w-4 items-center justify-center rounded-sm border leading-none disabled:opacity-50"
                  onClick={() => {
                    const rows = getValues("breakForm.rows");
                    const updatedRows = rows?.filter((_, i) => i !== rowIndex);
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
                  className="hover:bg-muted mr-0.5 flex h-4 w-4 cursor-pointer items-center justify-center border-0 text-xs leading-none disabled:opacity-50"
                  onClick={() => {
                    const rows = getValues("breakForm.rows");
                    const currentRow = rows?.[rowIndex];
                    if (!currentRow) return;

                    const newRow = {
                      ...currentRow,
                      isAdded: true,
                      name: "",
                      hours: currentRow.hours.map(() => "" as const),
                    };
                    const updatedRows = [
                      ...(rows?.slice(0, rowIndex + 1) ?? []),
                      newRow,
                      ...(rows?.slice(rowIndex + 1) ?? []),
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
                  "text-md w-18 border-0 bg-transparent! px-0 shadow-none md:w-full md:px-1",
                  rowHasTrue ? "text-rd!" : "",
                )}
              />
            </TableCell>
            <TableCell className="text-bl text-xs">
              {row.name && totalBreak}
            </TableCell>

            {TIME_LABELS.map((_time, timeIndex) => {
              const value = row.hours[timeIndex];
              const isTrue = isCurrentCell(TIME_LABELS[timeIndex], value);

              const startIndex = TIME_LABELS.findIndex(
                (t) => t === startTime.toString(),
              );

              const isView =
                timeIndex > startIndex - 1 && timeIndex < startIndex + 12;

              return (
                <TableCell key={timeIndex} className="p-0 px-1">
                  {isView ? (
                    <div className="flex items-center justify-center">
                      <SelectField
                        fieldName={`breakForm.rows.${rowIndex}.hours.${timeIndex}`}
                        data={MINUTES_SELECT}
                        className={cn(
                          "text-muted-foreground h-6! w-11! items-center justify-center px-0 shadow-none",
                          isTrue ? "text-rd! font-bold" : "",
                        )}
                      />
                    </div>
                  ) : (
                    <div
                      className={cn("bg-gr/40 h-6 w-6 rounded-md md:w-full")}
                    />
                  )}
                </TableCell>
              );
            })}

            {row.name && (
              <TableCell
                className="cursor-pointer p-0"
                onClick={() =>
                  setValue(`breakForm.rows.${rowIndex}.name`, "", {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <Trash2 className="text-rd h-3" />
              </TableCell>
            )}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
