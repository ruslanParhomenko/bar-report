"use client";
import SelectField from "@/components/input-controlled/select-field";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import { FieldArrayWithId, useFormContext, useWatch } from "react-hook-form";
import { calculateTipsTotal } from "../../lib/utils";
import { TipsForm } from "../../model/schema";

const ROLES: Array<"waiters" | "barmen"> = ["waiters", "barmen"];

export function TipsEditTableBody({
  data,
  monthDays,
  remove,
  selectedEmployees,
}: {
  data: FieldArrayWithId<TipsForm, "rowEmployeesTips", "id">[];
  monthDays: { day: number; weekday: string }[];
  remove: (index: number) => void;
  selectedEmployees: { id: string; name: string; role: string }[] | null;
}) {
  const { control, setValue, register } = useFormContext();

  const value = useWatch({
    control: control,
    name: "rowEmployeesTips",
  });

  const { perEmployee } = calculateTipsTotal(value);

  if (!selectedEmployees) return;

  return (
    <TableBody>
      {data.map((item, index) => {
        const employeeTotal = perEmployee[index]?.total ?? 0;
        return (
          <TableRow
            key={item.id}
            className="group [&>td]:py-1.5 [&>td]:text-xs"
          >
            <TableCell
              className="text-rd cursor-pointer"
              onClick={() => remove(index)}
            >
              {index + 1}
            </TableCell>

            <TableCell className="bg-background hover-cell sticky left-0 w-24 md:bg-transparent">
              <SelectField
                fieldName={`rowEmployeesTips.${index}.employee`}
                data={selectedEmployees
                  .filter((emp) =>
                    ROLES.includes(emp.role as "waiters" | "barmen"),
                  )
                  .map((emp) => emp.name)}
                className={cn(
                  "bg-background! h-6! justify-start truncate text-xs",
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
            </TableCell>
            <TableCell className="text-end text-green-600">
              {employeeTotal}
            </TableCell>

            {monthDays.map((_, dayIndex) => {
              return (
                <TableCell key={dayIndex} className="border-x">
                  <input
                    {...register(
                      `rowEmployeesTips.${index}.tipsByDay.${dayIndex}`,
                    )}
                    data-row={index}
                    data-col={dayIndex}
                    onKeyDown={handleMultiTableNavigation}
                    className="hover-cell h-6 w-full border-0 p-0 text-center shadow-none"
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
