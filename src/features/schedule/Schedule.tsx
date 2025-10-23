"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import SelectField from "@/components/inputs/SelectField";
import ScheduleHeader from "../settings/schedule/ScheduleHeader";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import { ScheduleData } from "@/app/actions/schedule/scheduleAction";
import { Button } from "@/components/ui/button";
import { useSchedules } from "@/providers/ScheduleProvider";
import { MailIcon, PencilIcon } from "lucide-react";
import { useAbility } from "@/providers/AbilityProvider";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { SHIFT_OPTIONS } from "../settings/schedule/constants";
import { cn } from "@/lib/utils";
import { usePrint } from "@/hooks/useToPrint";
import PrintButton from "@/components/buttons/PrintButton";
import { useTelegramScreenshot } from "@/hooks/useTelegramScreenshot";

const ROLE = {
  bar: "restaurant",
  cucina: "cucina",
  dish: "dish",
};
const SHIFTS = {
  bar: ["8", "9", "14", "18", "20"],
  cucina: ["7", "19"],
  dish: ["7", "19"],
};

export default function Schedule() {
  const KEY_PREFIX = "schedule-data";

  const { isAdmin, isMngr, isBar } = useAbility();
  const isDisabled = !isAdmin && !isMngr && !isBar;

  const schedules = useSchedules();
  const pathname = usePathname();

  const router = useRouter();
  const patch = pathname.split("/")[2];

  const { setValue, getValue } = useLocalStorageForm<any>(KEY_PREFIX);
  const selected = getValue();

  const form = useForm({
    defaultValues: selected || { month: "", year: "2025" },
  });

  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);

  const month = useWatch({ control: form.control, name: "month" });
  const year = useWatch({ control: form.control, name: "year" });

  const uniqueKey = useMemo(() => {
    const role = ROLE[patch as keyof typeof ROLE];
    return `${year}-${month}-${role}`;
  }, [month, year, patch]);

  useEffect(() => {
    const found = schedules.find((s: any) => s.uniqueKey === uniqueKey);
    setSchedule(found || (null as any));
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

  const YEAR = ["2025"];

  const color = {
    "7": "text-bl",
    "8": "text-bl",
    "9": "text-bl",
    "14": "text-gr",
    "18": "text-bk",
    "20": "text-bk",
  } as const;

  const todayDay = new Date().getDate();
  const todayIndex = monthDays.findIndex((day) => day.day === todayDay);
  useEffect(() => {
    if (todayIndex !== -1) {
      setSelectedColumn(todayIndex);
    }
  }, [todayIndex]);

  const { componentRef, handlePrint } = usePrint({ title: "schedule" });
  const { sendScreenshot, isSending } = useTelegramScreenshot(
    componentRef as any
  );

  return (
    <>
      <Form {...form}>
        <form className="flex gap-4 pb-2">
          <SelectField
            fieldName="month"
            data={MONTHS}
            placeHolder="month"
            className="w-40"
          />
          <SelectField
            fieldName="year"
            data={YEAR}
            placeHolder="year"
            className="w-40"
          />
        </form>
      </Form>
      {schedule && (
        <Card>
          <CardHeader className="w-full flex flex-row  items-start gap-4">
            <Button
              type="button"
              onClick={() => router.push(`/settings/schedule/${schedule?.id}`)}
              disabled={isDisabled}
              className="cursor-pointer"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <PrintButton onPrint={handlePrint} />
            <Button
              type="button"
              variant={"outline"}
              onClick={() => sendScreenshot("📅 График смен")}
            >
              <MailIcon className="h-4 w-4" />
            </Button>
          </CardHeader>
          <div ref={componentRef}>
            <Table>
              <ScheduleHeader
                monthDays={monthDays}
                setSelectedColumn={setSelectedColumn}
                month={schedule.month}
              />
              <TableBody className="[&_input]:h-8 [&_input]:text-xs [&_input]:p-0 [&_input]:text-center [&_input]:w-6 [&_input]:border-0">
                {schedule.rowShifts?.map((row, rowIndex) => {
                  const isSelected = !["v", "s", ""].includes(
                    row.shifts?.[selectedColumn as any]
                  );
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
                      <TableCell className="w-2 p-0"></TableCell>

                      {row.shifts?.map((day, dayIndex) => {
                        const isSelected = dayIndex === selectedColumn;

                        return (
                          <TableCell
                            key={dayIndex}
                            className={cn(
                              "p-0 text-center border-x",
                              ["v"].includes(day)
                                ? "bg-bl/70 border-x-bl/70"
                                : "",
                              color[day as keyof typeof color],
                              isSelected && "!text-rd font-bold"
                            )}
                          >
                            {["/", "v"].includes(day) ? null : day}
                          </TableCell>
                        );
                      })}

                      <TableCell className="w-6" />
                    </TableRow>
                  );
                })}
              </TableBody>

              <TableFooter>
                {SHIFT_OPTIONS.filter((item) =>
                  SHIFTS[patch as keyof typeof SHIFTS].includes(item)
                ).map((item, i) => (
                  <TableRow key={i} className="h-[16px] bg-card border-0">
                    <TableCell
                      colSpan={6}
                      className="text-end text-muted-gn h-[16px] pt-0.5 leading-none text-xs"
                    >
                      {item}
                    </TableCell>
                    {shiftCounts?.[item]?.map((day, index) => (
                      <TableCell
                        key={index}
                        className="w-8 text-center h-[16px] pt-0.5 leading-none text-xs text-muted-foreground"
                      >
                        {day === 0 ? null : day}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableFooter>
            </Table>
          </div>
        </Card>
      )}
    </>
  );
}
