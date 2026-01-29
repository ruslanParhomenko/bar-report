import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldArrayWithId, useWatch } from "react-hook-form";
import { TipsFormType } from "./schema";
import { Plus } from "lucide-react";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { useAbility } from "@/providers/AbilityProvider";
import SelectField from "@/components/inputs/SelectField";
import { cn } from "@/lib/utils";
import { calculateTipsTotal } from "./utils";

const ROLES: Array<"waiters" | "barmen"> = ["waiters", "barmen"];

export function TipsTableBody({
  data,
  monthDays,
  append,
  remove,
  form,
  selectedEmployees,
}: {
  data: FieldArrayWithId<TipsFormType, "rowEmployeesTips", "id">[];
  monthDays: { day: number; weekday: string }[];
  append: any;
  remove: (index: number) => void;
  form: any;
  selectedEmployees: { id: string; name: string; role: string }[];
}) {
  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;
  const value = useWatch({
    control: form.control,
    name: "rowEmployeesTips",
  });

  const { perEmployee } = calculateTipsTotal(value);

  return (
    <TableBody>
      {data.map((role, roleIndex) => {
        const employeeTotal = perEmployee[roleIndex]?.total ?? 0;
        return (
          <TableRow
            key={role.id}
            className="hover:bg-gr/10 hover:text-rd group"
          >
            <TableCell
              className="text-rd p-1 cursor-pointer"
              onClick={() => !isDisabled && remove(roleIndex)}
            >
              {roleIndex + 1}
            </TableCell>

            <TableCell className="sticky left-0 p-1 bg-background w-24 employee-cell">
              <SelectField
                fieldName={`rowEmployeesTips.${roleIndex}.employee`}
                data={selectedEmployees
                  .filter((emp) =>
                    ROLES.includes(emp.role as "waiters" | "barmen"),
                  )
                  .map((emp) => emp.name)}
                disabled={isDisabled}
                className={cn(
                  "justify-start  h-6! text-[13px] pl-1 w-34",
                  value[roleIndex]?.role === "barmen" &&
                    "text-muted-foreground font-light!",
                )}
              />
            </TableCell>
            <TableCell className="p-0 border-r">
              <span className="text-xs font-bold text-green-700">
                {employeeTotal}
              </span>
            </TableCell>

            {monthDays.map((_day, dayIndex) => {
              return (
                <TableCell key={dayIndex} className="p-0.5 border-r relative">
                  <input
                    {...form.register(
                      `rowEmployeesTips.${roleIndex}.tipsByDay.${dayIndex}`,
                    )}
                    data-row={roleIndex}
                    data-col={dayIndex}
                    onKeyDown={(e) =>
                      handleTableNavigation(e, roleIndex, dayIndex)
                    }
                    className="w-11 h-6 text-xs text-center p-0 border-0 shadow-none"
                    disabled={isDisabled}
                  />
                  {form.formState.errors?.rowEmployeesTips?.[roleIndex]
                    ?.tipsByDay?.[dayIndex]?.message && (
                    <span className="text-red-500 text-xs absolute bottom-[-6] left-0">
                      {
                        form.formState.errors.rowEmployeesTips[roleIndex]
                          .tipsByDay[dayIndex].message
                      }
                    </span>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
      <TableRow>
        <TableCell
          colSpan={monthDays.length + 3}
          className="text-start border-b"
        >
          <button
            type="button"
            disabled={isDisabled}
            className="cursor-pointer hover:bg-accent"
            onClick={() =>
              append({
                id: (data.length + 1).toString(),
                employee: "",
                role: "",
                tips: "",
                tipsByDay: Array(monthDays.length).fill(""),
              })
            }
          >
            <Plus size={12} className="text-bl" />
          </button>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
