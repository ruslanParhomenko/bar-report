"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import SelectField from "@/components/inputs/SelectField";
import ScheduleHeader from "../settings/schedule/ScheduleHeader";
import { getMonthDays, MONTHS, YEAR } from "@/utils/getMonthDays";
// import { ScheduleData } from "@/app/actions/schedule/scheduleAction";
import { Button } from "@/components/ui/button";
import { useSchedules } from "@/providers/ScheduleProvider";
import { MailIcon, PencilIcon } from "lucide-react";
import { useAbility } from "@/providers/AbilityProvider";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import {
  color,
  COLOR_SHIFT,
  ROLE_URL,
  SHIFT_OPTIONS,
  SHIFTS,
} from "../settings/schedule/constants";
import { cn } from "@/lib/utils";
import { usePrint } from "@/hooks/useToPrint";
import PrintButton from "@/components/buttons/PrintButton";
import { useTelegramScreenshot } from "@/hooks/useTelegramScreenshot";

export default function Schedule() {
  const KEY_PREFIX = "schedule-data";

  const { isAdmin, isMngr } = useAbility();
  const isDisabled = !isAdmin && !isMngr;

  const schedules = useSchedules();

  const router = useRouter();
  const pathname = usePathname();
  const patch = pathname.split("/")[2];

  // set local storage
  const { setValue, getValue } = useLocalStorageForm<any>(KEY_PREFIX);
  const selected = getValue();

  // form
  const currentYear = new Date().getFullYear().toString();
  const form = useForm({
    defaultValues: selected || { month: "", year: currentYear },
  });

  // state schedule
  const [schedule, setSchedule] = useState<any | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

  const month = useWatch({ control: form.control, name: "month" });
  const year = useWatch({ control: form.control, name: "year" });

  // unique key
  const uniqueKey = useMemo(() => {
    const role = ROLE_URL[patch as keyof typeof ROLE_URL];
    return `${year}-${month}-${role}`;
  }, [month, year, patch]);

  useEffect(() => {
    const found = schedules.find((s) => s.uniqueKey === uniqueKey);
    setSchedule(found || null);
  }, [uniqueKey]);

  const monthDays = useMemo(() => {
    if (!schedule?.month || !schedule?.year) return [];
    return getMonthDays({ month: schedule.month, year: schedule.year });
  }, [schedule]);

  const shiftCounts = useMemo(() => {
    if (!schedule?.rowShifts?.length) return {};

    const daysCount = schedule.rowShifts[0]?.shifts?.length || 0;
    const result = Object.fromEntries(
      SHIFT_OPTIONS.map((s) => [s, Array(daysCount).fill(0)])
    );

    schedule.rowShifts.forEach((row: any) => {
      row.shifts.forEach((shiftValue: string, dayIndex: number) => {
        if (SHIFT_OPTIONS.includes(shiftValue)) {
          result[shiftValue][dayIndex] += 1;
        }
      });
    });

    return result;
  }, [schedule]);

  useEffect(() => {
    setValue({ month, year });
  }, [month, setValue, year]);

  const todayDay = new Date().getDate();
  const todayIndex = monthDays.findIndex((day) => day.day === todayDay);
  useEffect(() => {
    if (todayIndex !== -1) {
      setSelectedColumn(todayIndex);
    }
  }, [todayIndex]);

  const { componentRef, handlePrint } = usePrint({ title: "schedule" });
  const { sendScreenshot, isSending } = useTelegramScreenshot({
    ref: componentRef as React.RefObject<HTMLElement>,
    tagName: patch as string,
  });
  return (
    <>
      <Form {...form}>
        <form className="flex items-center justify-between px-2 pt-2 pb-4">
          <div className="flex gap-2">
            <SelectField
              fieldName="month"
              data={MONTHS}
              placeHolder="month"
              className="w-24 p-0 h-8!"
            />
            <SelectField
              fieldName="year"
              data={YEAR}
              placeHolder="year"
              className="w-20 p-0 h-8!"
            />
          </div>
          {schedule && (
            <div className="flex flex-row  items-start md:gap-4 gap-1">
              <Button
                size={"sm"}
                type="button"
                variant={"outline"}
                onClick={() =>
                  router.push(`/settings/schedule/${schedule?.id}`)
                }
                disabled={isDisabled}
                className="cursor-pointer p-0"
              >
                <PencilIcon className="h-3 w-3" />
              </Button>
              <PrintButton onPrint={handlePrint} />
              <Button
                size={"sm"}
                type="button"
                variant={"outline"}
                onClick={() => sendScreenshot("📅 График смен")}
                disabled={isDisabled || isSending}
                className="cursor-pointer"
              >
                <MailIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </form>
      </Form>
      <div ref={componentRef}>
        {schedule && (
          <Table>
            <ScheduleHeader
              monthDays={monthDays}
              setSelectedColumn={setSelectedColumn}
              month={schedule.month}
            />
            <TableBody className="[&_input]:h-8 [&_input]:text-xs [&_input]:p-0 [&_input]:text-center [&_input]:w-6 [&_input]:border-0">
              {schedule.rowShifts?.map((row: any, rowIndex: number) => {
                const isSelected = !["v", "s", ""].includes(
                  row.shifts?.[selectedColumn as number]
                );
                const dayHourPay = (Number(row.rate) / 180) * 0.9; // минус 10%
                const nightHourPay = (Number(row.rate) / 180) * 1.15; // плюс 15%
                const totalPay =
                  dayHourPay * Number(row.dayHours) +
                  nightHourPay * Number(row.nightHours);

                return (
                  <TableRow key={row.id} className="hover:text-rd">
                    <TableCell>{rowIndex + 1}</TableCell>
                    <TableCell className="text-bl text-xs">
                      {row.dayHours}
                    </TableCell>
                    <TableCell className="text-bl text-xs">
                      {row.nightHours}
                    </TableCell>
                    <TableCell>{row.totalHours}</TableCell>
                    <TableCell
                      className={cn(
                        "sticky left-0 bg-card text-muted-foreground w-34 p-0",
                        isSelected && "text-rd font-bold"
                      )}
                    >
                      {row.employee}
                    </TableCell>
                    <TableCell
                      className="w-2 p-0 text-start text-muted-foreground font-bold no-print"
                      data-html2canvas-ignore="true"
                    >
                      {!isDisabled && totalPay.toFixed(0).toString()}
                    </TableCell>

                    {row.shifts?.map((day: string, dayIndex: number) => {
                      const isSelected = dayIndex === selectedColumn;

                      return (
                        <TableCell
                          key={dayIndex}
                          className={cn(
                            "p-0 text-center border-x",
                            color[day as keyof typeof color],
                            isSelected && "!text-rd font-bold"
                          )}
                        >
                          {["/", "v", "s"].includes(day) ? null : day}
                        </TableCell>
                      );
                    })}

                    <TableCell className="w-6" />
                  </TableRow>
                );
              })}
            </TableBody>

            <TableFooter data-html2canvas-ignore="true" className="no-print">
              {SHIFT_OPTIONS.filter((item) =>
                SHIFTS[patch as keyof typeof SHIFTS].includes(item)
              ).map((item, i) => (
                <TableRow key={i} className="h-6 bg-card border-0">
                  <TableCell
                    colSpan={6}
                    className="text-end text-muted-gn h-6 pt-0.5 leading-none text-xs"
                  >
                    {item}
                  </TableCell>
                  {shiftCounts?.[item]?.map((day, index) => (
                    <TableCell
                      key={index}
                      className={cn(
                        "w-8 text-center h-6 pt-0.5 leading-none text-xs text-muted-foreground",
                        COLOR_SHIFT[day as keyof typeof COLOR_SHIFT]
                      )}
                    >
                      {day === 0 ? null : day}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>
        )}
      </div>
    </>
  );
}
