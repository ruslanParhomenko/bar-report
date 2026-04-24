import SelectField from "@/components/input-controlled/select-field";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import { FieldArrayWithId, useFormContext, useWatch } from "react-hook-form";
import { TipsForm } from "./schema";
import { calculateTipsTotal } from "./utils";

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
              className="text-rd cursor-pointer p-0.5 text-xs"
              onClick={() => isEdit && remove(index)}
            >
              {index + 1}
            </TableCell>

            <TableCell className="bg-background hover-cell sticky left-0 w-24 p-1 md:bg-transparent">
              {isEdit ? (
                <SelectField
                  fieldName={`rowEmployeesTips.${index}.employee`}
                  data={selectedEmployees
                    .filter((emp) =>
                      ROLES.includes(emp.role as "waiters" | "barmen"),
                    )
                    .map((emp) => emp.name)}
                  className={cn(
                    "bg-background! h-6! w-34 justify-start pl-1 text-[13px]",
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
                    "flex h-6 items-center text-xs font-bold",
                    item.role === "barmen" &&
                      "text-muted-foreground font-light!",
                  )}
                >
                  {item.employee}
                </div>
              )}
            </TableCell>
            <TableCell className="p-0 pr-2 text-end text-xs text-green-600">
              {employeeTotal}
            </TableCell>

            {monthDays.map((_, dayIndex) => {
              const isSelected = dayIndex + 1 === selectedDay;
              return (
                <TableCell key={dayIndex} className="relative border-x p-0.5">
                  <input
                    {...register(
                      `rowEmployeesTips.${index}.tipsByDay.${dayIndex}`,
                    )}
                    data-row={index}
                    data-col={dayIndex}
                    onKeyDown={handleMultiTableNavigation}
                    className={cn(
                      isSelected && "text-rd font-bold",
                      "hover-cell h-6 w-11 border-0 p-0 text-center text-xs shadow-none",
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
