import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldArrayWithId } from "react-hook-form";
import { TipsFormType } from "./schema";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import SelectScheduleEmployee from "@/components/inputs/SelectScheduleEmployee";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";

const ROLES: Array<"waiters" | "barmen" | "dish"> = [
  "waiters",
  "barmen",
  "dish",
];

export default function TableBodyData({
  data,
  monthDays,
  disabled,
  append,
  remove,
  move,
  dataRowsCount,
  form,
  selectedEmployees,
}: {
  data: FieldArrayWithId<TipsFormType, "rowEmployeesTips", "id">[];
  monthDays: { day: number; weekday: string }[];
  disabled?: boolean;
  append: any;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  dataRowsCount: any;
  form: any;
  selectedEmployees: { id: string; name: string; role: string }[];
}) {
  useEffect(() => {
    const subscription = form.watch((_: any, { name }: any) => {
      if (name?.includes("rowEmployeesTips")) {
        const match = name.match(/rowEmployeesTips\.(\d+)\.tipsByDay/);
        if (match) {
          const rowIndex = parseInt(match[1]);
          const tipsByDay =
            form.getValues(`rowEmployeesTips.${rowIndex}.tipsByDay`) || [];

          const totalTips = tipsByDay.reduce(
            (sum: number, t: string) => sum + (parseFloat(t) || 0),
            0
          );

          const currentTips = parseFloat(
            form.getValues(`rowEmployeesTips.${rowIndex}.tips`) || "0"
          );

          // Только если изменилось — обновляем
          if (currentTips !== totalTips) {
            form.setValue(
              `rowEmployeesTips.${rowIndex}.tips`,
              totalTips.toString()
            );
            form.setValue(
              `rowEmployeesTips.${rowIndex}.rate`,
              totalTips.toString()
            );
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <>
      {ROLES.map((role) => {
        const roleRows = data.filter((row) => row.role === role);
        if (roleRows.length === 0) return null;

        return (
          <TableBody key={role}>
            {roleRows.map((row, rowIndex) => {
              const globalIndex = data.indexOf(row);
              const rowNumber = dataRowsCount.findIndex(
                (r: any) => r.id === row.id
              );

              return (
                <TableRow key={row.id} className="hover:bg-gr/10 hover:text-rd">
                  <TableCell
                    className="text-rd p-0"
                    onClick={() => !disabled && remove(globalIndex)}
                  >
                    {rowIndex + 1}
                  </TableCell>

                  <TableCell className="sticky left-0 p-0">
                    <SelectScheduleEmployee
                      fieldName={`rowEmployeesTips.${globalIndex}.employee`}
                      data={selectedEmployees.filter(
                        (emp) => emp.role === role
                      )}
                      className="justify-start text-center"
                      disabled={disabled}
                    />
                  </TableCell>
                  <TableCell className="p-0">
                    <input
                      type="text"
                      readOnly
                      value={
                        form.getValues(
                          `rowEmployeesTips.${globalIndex}.tips`
                        ) || 0
                      }
                      className="w-full text-center text-muted-foreground p-0 font-medium"
                    />
                  </TableCell>

                  {monthDays.map((_day, dayIndex) => (
                    <TableCell key={dayIndex} className="p-0.5">
                      <Input
                        {...form.register(
                          `rowEmployeesTips.${globalIndex}.tipsByDay.${dayIndex}`
                        )}
                        data-row={rowNumber}
                        data-col={dayIndex}
                        onKeyDown={(e) =>
                          handleTableNavigation(e, rowNumber, dayIndex)
                        }
                        className={cn(
                          "w-full h-6 bg-border text-xs text-center p-0"
                        )}
                        disabled={disabled}
                      />
                    </TableCell>
                  ))}

                  <TableCell className="flex flex-col justify-center items-center p-0">
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={rowIndex === 0 || disabled}
                      onClick={() => {
                        if (rowIndex > 0) {
                          const targetGlobalIndex = data.indexOf(
                            roleRows[rowIndex - 1]
                          );
                          move(globalIndex, targetGlobalIndex);
                        }
                      }}
                      className="w-3 h-4 p-0 flex items-center justify-center"
                    >
                      <ChevronUp className="w-2" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={rowIndex === roleRows.length - 1 || disabled}
                      onClick={() => {
                        if (rowIndex < roleRows.length - 1) {
                          const targetGlobalIndex = data.indexOf(
                            roleRows[rowIndex + 1]
                          );
                          move(globalIndex, targetGlobalIndex);
                        }
                      }}
                      className="w-3 h-4 p-0 flex items-center justify-center"
                    >
                      <ChevronDown className="w-2" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell
                colSpan={monthDays.length + 3}
                className="p-1 text-start"
              >
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={disabled}
                  onClick={() =>
                    append({
                      id: (data.length + 1).toString(),
                      employee: "",
                      role: role,
                      tips: "",
                      tipsByDay: Array(monthDays.length).fill(""),
                    })
                  }
                >
                  <Plus />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        );
      })}
    </>
  );
}
