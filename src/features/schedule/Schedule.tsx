"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
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
import { getSchedule } from "@/app/actions/schedule/getSchedule";
import { ScheduleData } from "@/app/actions/schedule/scheduleAction";
import { SHIFT_OPTIONS } from "../settings/constants";
import { Button } from "@/components/ui/button";

const ROLE = {
  bar: "restaurant",
  cucina: "cucina",
  dish: "dish",
};

export default function Schedule() {
  const pathname = usePathname();
  const patch = pathname.split("/")[2];
  const form = useForm({ defaultValues: { month: "", year: "2025" } });
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);

  const month = useWatch({ control: form.control, name: "month" });
  const year = useWatch({ control: form.control, name: "year" });

  const uniqueKey = useMemo(() => {
    const role = ROLE[patch as keyof typeof ROLE];
    return `${year}-${month}-${role}`;
  }, [month, year, patch]);

  // Загрузка данных при изменении ключа
  useEffect(() => {
    async function load() {
      const all = await getSchedule();
      const found = all.find((s: any) => s.uniqueKey === uniqueKey);
      setSchedule(found || (null as any));
    }
    load();
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

  const YEAR = ["2025"];

  return (
    <Card className="w-full md:p-6">
      <Form {...form}>
        <form className="flex flex-col">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4">
            <div className="flex justify-between items-center gap-1">
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
            </div>
            <div>
              <Button type="button" onClick={() => form.reset()}>
                Delete
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {!schedule ? (
        <div className="text-center text-muted-foreground py-10 text-sm">
          No schedule found for this selection.
        </div>
      ) : (
        <Table>
          <ScheduleHeader monthDays={monthDays} />
          <TableBody className="[&_input]:h-8 [&_input]:text-xs [&_input]:p-0 [&_input]:text-center [&_input]:w-6 [&_input]:border-0">
            {schedule.rowShifts?.map((row, rowIndex) => (
              <TableRow key={row.id} className="hover:text-rd">
                <TableCell>{rowIndex + 1}</TableCell>
                <TableCell className="text-bl">
                  {row.dayHours}:{row.nightHours}
                </TableCell>
                <TableCell>{row.totalHours}</TableCell>
                <TableCell className="sticky left-0">{row.employee}</TableCell>
                <TableCell className="w-2 p-0"></TableCell>

                {row.shifts?.map((day, dayIndex) => (
                  <TableCell key={dayIndex} className="p-0 text-center">
                    {day}
                  </TableCell>
                ))}

                <TableCell className="w-6" />
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            {SHIFT_OPTIONS.map((item, i) => (
              <TableRow key={i} className="h-[16px] bg-card border-0">
                <TableCell
                  colSpan={5}
                  className="text-end text-muted-foreground h-[16px] pt-0.5 leading-none text-xs"
                >
                  {item}
                </TableCell>
                {shiftCounts?.[item]?.map((day, index) => (
                  <TableCell
                    key={index}
                    className="w-8 text-center h-[16px] pt-0.5 leading-none text-xs"
                  >
                    {day === 0 ? null : day}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      )}
    </Card>
  );
}
