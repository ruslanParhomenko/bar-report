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
import { useSidebar } from "@/components/ui/sidebar";
import { useEmployees } from "@/providers/EmployeeProvider";
import { BreakListFormValues } from "./schema";

const BAR_EMPLOYEES = ["waiters", "barmen"];
export const BreakListTable = () => {
  const { isObserver, isCucina, isUser } = useAbility();
  const isDisabled = isObserver || isCucina || isUser;
  const { isMobile } = useSidebar();

  const { employees } = useEmployees();
  const selectedEmployees = employees
    .filter((emp) => BAR_EMPLOYEES.includes(emp.position))
    .map((employee) => employee.name);

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const form = useFormContext<BreakListFormValues>();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead></TableHead>
          {TIME_LABELS.map((h, i) => {
            const isCurrentHour = Number(h === "24" ? "00" : h) === currentHour;
            return (
              <TableHead
                key={i}
                className={`text-center text-xl ${
                  isCurrentHour ? "text-rd font-bold text-xl" : "text-bl"
                }`}
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
            const value = form.getValues(
              fieldName as Path<BreakListFormValues>
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

            return (
              isCurrentHour &&
              ((isCurrentMinute00 && selectedValue === "00") ||
                (isCurrentMinute20 && selectedValue === "20") ||
                (isCurrentMinute40 && selectedValue === "40"))
            );
          });

          return (
            <TableRow key={`${row.id}-${rowIndex}`}>
              <TableCell>
                <input value={row.id} disabled className="w-10 text-center" />
              </TableCell>

              <TableCell
                className={`${
                  isMobile
                    ? "sticky left-0 z-10 text-left bg-background/90"
                    : "text-left"
                }`}
              >
                <SelectField
                  fieldName={`rows[${rowIndex}].name`}
                  data={selectedEmployees}
                  disabled={isDisabled}
                  className={`!min-w-[120px] md:w-[160px] text-base ${
                    rowHasTrue ? "!text-rd" : ""
                  }`}
                />
              </TableCell>

              {TIME_LABELS.map((time, timeIndex) => {
                const fieldName = `rows.${rowIndex}.hours.${time}`;
                const value = form.getValues(
                  fieldName as Path<BreakListFormValues>
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
                      className={`${
                        isTrue ? "!text-rd font-bold text-[18px]" : ""
                      } ${
                        selectedValue === "X" ? "bg-[#727171]" : "bg-background"
                      }`}
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
