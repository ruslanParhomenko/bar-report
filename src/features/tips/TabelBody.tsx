import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldArrayWithId } from "react-hook-form";
import { TipsFormType } from "./schema";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import SelectScheduleEmployee from "@/components/inputs/SelectScheduleEmployee";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { cn } from "@/lib/utils";

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
  return (
    <>
      {ROLES.map((role, roleIndex) => {
        const roleRows = data.filter((row) => row.role === role);
        if (roleRows.length === 0) return null;

        return (
          <TableBody key={role}>
            {roleIndex > 0 && (
              <TableRow>
                <TableCell
                  colSpan={monthDays.length + 3}
                  className="h-2 bg-bl"
                ></TableCell>
              </TableRow>
            )}

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
                      employeeId: "",
                      employee: "",
                      role: role,
                      rate: "",
                      tips: "",
                      tipsByDay: Array(monthDays.length).fill(""),
                    })
                  }
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </TableCell>
            </TableRow>

            {roleRows.map((row, rowIndex) => {
              const globalIndex = data.indexOf(row);
              const rowNumber = dataRowsCount.findIndex(
                (r: any) => r.id === row.id
              );
              return (
                <TableRow key={row.id} className="hover:text-rd p-0 h-6">
                  <TableCell
                    className="text-rd cursor-pointer p-0 h-6"
                    onClick={() => !disabled && remove(globalIndex)}
                  >
                    {rowIndex + 1}
                  </TableCell>

                  <TableCell className="sticky left-0 p-0 bg-card">
                    <SelectScheduleEmployee
                      fieldName={`rowEmployeesTips.${globalIndex}.employee`}
                      data={selectedEmployees.filter(
                        (emp) => emp.role === role
                      )}
                      className="w-full hover:text-rd justify-start h-6!"
                      disabled={disabled}
                    />
                  </TableCell>

                  {monthDays.map((_day, dayIndex) => (
                    <TableCell key={dayIndex} className="p-1 h-6">
                      <input
                        {...form.register(
                          `rowEmployeesTips.${globalIndex}.tipsByDay.${dayIndex}`
                        )}
                        data-row={rowNumber}
                        data-col={dayIndex}
                        onKeyDown={(e) =>
                          handleTableNavigation(e, rowNumber, dayIndex)
                        }
                        className={cn(
                          "w-full h-6 bg-border text-sm text-center"
                        )}
                        disabled={disabled}
                      />
                    </TableCell>
                  ))}

                  <TableCell className="w-6 flex flex-col justify-center items-center p-0">
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
                      className="w-3 h-3 p-0 flex items-center justify-center"
                    >
                      <ChevronUp className="w-2 h-3" />
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
                      className="w-3 h-3 p-0 flex items-center justify-center"
                    >
                      <ChevronDown className="w-2 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        );
      })}
    </>
  );
}
