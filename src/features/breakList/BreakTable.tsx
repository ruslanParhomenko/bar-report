"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  INTERVAL_00,
  INTERVAL_20,
  INTERVAL_40,
  MINUTES_SELECT,
  TIME_LABELS,
} from "./constant";
import { Path, useFormContext } from "react-hook-form";
import SelectField from "@/components/inputs/SelectField";
import { useAbility } from "@/providers/AbilityProvider";
import { useTheme } from "next-themes";
import { BreakRemarksData } from "./schema";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const BAR_EMPLOYEES = ["waiters", "barmen"];
export const BreakListTable = ({
  employees,
}: {
  employees: { name: string; role: string }[];
}) => {
  const { isObserver, isCucina, isUser } = useAbility();
  const isDisabled = isObserver || isCucina || isUser;
  const { theme } = useTheme();

  const selectedEmployees = employees
    .filter((emp) => BAR_EMPLOYEES.includes(emp.role))
    .map((employee) => employee.name);

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const form = useFormContext<BreakRemarksData>();
  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"></TableHead>
          <TableHead className="w-28">
            <Label className="text-lg font-semibold text-bl">Break</Label>
          </TableHead>

          {TIME_LABELS.map((h, i) => {
            const isCurrentHour = Number(h === "24" ? "00" : h) === currentHour;
            return (
              <TableHead
                key={i}
                className={cn(
                  "text-center text-xl w-12",
                  isCurrentHour ? "text-rd font-bold text-xl" : "text-bl"
                )}
              >
                {h}:
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>

      <TableBody>
        {form.getValues("rows")?.map((row, rowIndex) => {
          const rowHasTrue = TIME_LABELS.some((time) => {
            const fieldName = `rows.${rowIndex}.hours.${time}`;
            const value = form.getValues(fieldName as Path<BreakRemarksData>);

            const selectedValue = Array.isArray(value) ? value[0] : value;

            const isCurrentHour = Number(time) === currentHour;

            const isCurrentMinute00 = INTERVAL_00.includes(
              currentMinute.toLocaleString()
            );
            const isCurrentMinute20 = INTERVAL_20.includes(
              currentMinute.toLocaleString()
            );
            const isCurrentMinute40 = INTERVAL_40.includes(
              currentMinute.toLocaleString()
            );

            return (
              isCurrentHour &&
              ((isCurrentMinute00 && selectedValue === "00") ||
                (isCurrentMinute20 && selectedValue === "20") ||
                (isCurrentMinute40 && selectedValue === "40"))
            );
          });

          return (
            <TableRow key={`${row.id}-${rowIndex}`}>
              <TableCell className="p-0">
                <Input
                  value={row.id}
                  disabled
                  className="text-center p-0 border-0 shadow-none text-bl"
                  readOnly
                />
              </TableCell>

              <TableCell className="sticky left-0 z-10 text-left p-0">
                <SelectField
                  fieldName={`rows[${rowIndex}].name`}
                  data={selectedEmployees}
                  disabled={isDisabled}
                  placeHolder="..."
                  className={cn(
                    "justify-start",
                    rowHasTrue ? "!text-rd" : "!text-black",
                    "border-0 shadow-none"
                  )}
                />
              </TableCell>

              {TIME_LABELS.map((time, timeIndex) => {
                const fieldName = `rows.${rowIndex}.hours.${time}`;
                const value = form.getValues(
                  fieldName as Path<BreakRemarksData>
                );
                const selectedValue = Array.isArray(value) ? value[0] : value;

                const isCurrentHour = Number(time) === currentHour;
                const isCurrentMinute00 = INTERVAL_00.includes(
                  currentMinute.toLocaleString()
                );
                const isCurrentMinute20 = INTERVAL_20.includes(
                  currentMinute.toLocaleString()
                );
                const isCurrentMinute40 = INTERVAL_40.includes(
                  currentMinute.toLocaleString()
                );

                const isTrue =
                  isCurrentHour &&
                  ((isCurrentMinute00 && selectedValue === "00") ||
                    (isCurrentMinute20 && selectedValue === "20") ||
                    (isCurrentMinute40 && selectedValue === "40"));

                return (
                  <TableCell key={timeIndex}>
                    <SelectField
                      fieldName={`rows[${rowIndex}].hours.${time}`}
                      data={MINUTES_SELECT}
                      disabled={isDisabled}
                      className={cn(
                        "!h-8",
                        isTrue ? "!text-rd font-bold text-[18px]" : "",

                        selectedValue === "X"
                          ? theme === "dark"
                            ? "!bg-black !text-black border-0"
                            : "bg-[#727171]"
                          : "bg-background"
                      )}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
