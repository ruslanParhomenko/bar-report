import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldArrayWithId } from "react-hook-form";
import { TipsFormType } from "./schema";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import SelectScheduleEmployee from "@/components/inputs/SelectScheduleEmployee";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAbility } from "@/providers/AbilityProvider";

const ROLES: Array<"waiters" | "barmen" | "dish"> = [
  "waiters",
  "barmen",
  "dish",
];

export function TipsTableBody({
  data,
  monthDays,
  append,
  remove,
  move,
  dataRowsCount,
  form,
  selectedEmployees,
}: {
  data: FieldArrayWithId<TipsFormType, "rowEmployeesTips", "id">[];
  monthDays: { day: number; weekday: string }[];
  append: any;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  dataRowsCount: any;
  form: any;
  selectedEmployees: { id: string; name: string; role: string }[];
}) {
  const { isAdmin, isManager, isCash } = useAbility();
  const isDisabled = !isAdmin && !isManager;
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
                    onClick={() => !isDisabled && remove(globalIndex)}
                  >
                    {rowIndex + 1}
                  </TableCell>

                  <TableCell className="sticky left-0 p-0">
                    <SelectScheduleEmployee
                      fieldName={`rowEmployeesTips.${globalIndex}.employee`}
                      data={selectedEmployees.filter(
                        (emp) => emp.role === role
                      )}
                      className="justify-start text-center h-6!"
                      disabled={isDisabled}
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
                        disabled={isDisabled}
                      />
                    </TableCell>
                  ))}

                  <TableCell className="flex flex-col justify-center items-center p-0">
                    <button
                      type="button"
                      disabled={rowIndex === 0 || isDisabled}
                      onClick={() => {
                        if (rowIndex > 0) {
                          const targetGlobalIndex = data.indexOf(
                            roleRows[rowIndex - 1]
                          );
                          move(globalIndex, targetGlobalIndex);
                        }
                      }}
                      className="p-0 flex items-center justify-center"
                    >
                      <ChevronUp className="w-3.5 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={rowIndex === roleRows.length - 1 || isDisabled}
                      onClick={() => {
                        if (rowIndex < roleRows.length - 1) {
                          const targetGlobalIndex = data.indexOf(
                            roleRows[rowIndex + 1]
                          );
                          move(globalIndex, targetGlobalIndex);
                        }
                      }}
                      className="p-0 flex items-center justify-center"
                    >
                      <ChevronDown className="w-3.5 h-3" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell
                colSpan={monthDays.length + 3}
                className="p-1 text-start"
              >
                <button
                  type="button"
                  disabled={isDisabled}
                  className="cursor-pointer hover:bg-accent"
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
                  <Plus size={14} className="text-bl" />
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        );
      })}
    </>
  );
}
