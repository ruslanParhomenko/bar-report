import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldArrayWithId, useFormContext, useWatch } from "react-hook-form";
import { TipsForm } from "./schema";
import SelectField from "@/components/input-controlled/select-field";
import { cn } from "@/lib/utils";
import { calculateTipsTotal } from "./utils";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";

const ROLES: Array<"waiters" | "barmen"> = ["waiters", "barmen"];

export function TipsTableBody({
  data,
  monthDays,
  remove,
  selectedEmployees,
  selectedDay,
  isEdit,
}: {
  data: FieldArrayWithId<TipsForm, "rowEmployeesTips", "id">[];
  monthDays: { day: number; weekday: string }[];
  remove: (index: number) => void;
  selectedEmployees: { id: string; name: string; role: string }[];
  selectedDay: number;
  isEdit: boolean;
}) {
  const { control, setValue, register } = useFormContext();

  const value = useWatch({
    control: control,
    name: "rowEmployeesTips",
  });

  const { perEmployee } = calculateTipsTotal(value);

  return (
    <TableBody>
      {data.map((item, index) => {
        const employeeTotal = perEmployee[index]?.total ?? 0;
        return (
          <TableRow key={item.id} className="group">
            <TableCell
              className="text-rd p-0.5 cursor-pointer text-xs"
              onClick={() => isEdit && remove(index)}
            >
              {index + 1}
            </TableCell>

            <TableCell className="sticky left-0 p-1 bg-background md:bg-transparent w-24 hover-cell">
              {isEdit ? (
                <SelectField
                  fieldName={`rowEmployeesTips.${index}.employee`}
                  data={selectedEmployees
                    .filter((emp) =>
                      ROLES.includes(emp.role as "waiters" | "barmen"),
                    )
                    .map((emp) => emp.name)}
                  className={cn(
                    "justify-start  h-6! text-[13px] pl-1 w-34 bg-background!",
                    value[index]?.role === "barmen" &&
                      "text-muted-foreground font-light!",
                  )}
                  onChange={(field) => {
                    const role = selectedEmployees.find(
                      (emp) => emp.name === field,
                    );
                    setValue(`rowEmployeesTips.${index}.role`, role?.role, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                />
              ) : (
                <div
                  className={cn(
                    "text-xs h-6 font-bold flex items-center",
                    item.role === "barmen" &&
                      "text-muted-foreground font-light!",
                  )}
                >
                  {item.employee}
                </div>
              )}
            </TableCell>
            <TableCell className="p-0 text-xs text-green-600 text-end pr-2">
              {employeeTotal}
            </TableCell>

            {monthDays.map((_, dayIndex) => {
              const isSelected = dayIndex + 1 === selectedDay;
              return (
                <TableCell key={dayIndex} className="p-0.5 border-x relative">
                  <input
                    {...register(
                      `rowEmployeesTips.${index}.tipsByDay.${dayIndex}`,
                    )}
                    data-row={index}
                    data-col={dayIndex}
                    onKeyDown={handleMultiTableNavigation}
                    className={cn(
                      isSelected && "text-rd font-bold",
                      "w-11 h-6 text-xs text-center p-0 border-0 shadow-none hover-cell",
                    )}
                    disabled={!isEdit}
                  />
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
