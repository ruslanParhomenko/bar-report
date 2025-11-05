"use client";
import SelectField from "@/components/inputs/SelectField";
import { Form } from "@/components/ui/form";
import { useSchedules } from "@/providers/ScheduleProvider";
import { MONTHS, YEAR } from "@/utils/getMonthDays";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

// import { ScheduleData } from "@/app/actions/schedule/scheduleAction";
import { extractUniqueEmployees, getRemarksByMonth } from "./utils";

import { remarksByUniqueEmployee } from "../penalty/utils";
import EmployeeTables from "./ResultTableByData";

export default function ResultTable({
  dataTips,
  remarks,
}: {
  dataTips: any[];
  remarks: any;
}) {
  const schedules = useSchedules();
  // state schedule
  const [selectedData, setSelectedData] = useState<any[] | null>(null);

  console.log(selectedData);
  const form = useForm({
    defaultValues: {
      month: MONTHS[new Date().getMonth()],
      year: new Date().getFullYear().toString(),
    },
  });
  const month = useWatch({ control: form.control, name: "month" });
  const year = useWatch({ control: form.control, name: "year" });

  // unique key
  const uniqueKey = useMemo(() => {
    return `${year}-${month}`;
  }, [month, year]);

  useEffect(() => {
    const scheduleByMonth = schedules.filter((s) => {
      const select =
        s.uniqueKey.split("-")[0] + "-" + s.uniqueKey.split("-")[1];
      return select === uniqueKey;
    });

    const remarksByMonth = getRemarksByMonth(remarks, uniqueKey, MONTHS);

    const dataTipItem = dataTips.find(
      (item: any) => item.unique_id === uniqueKey
    );
    const dataTipsForMonth = dataTipItem?.form_data?.rowEmployeesTips || [];

    const remarksByEmployee =
      remarksByUniqueEmployee(remarksByMonth).formattedData;

    const employees = extractUniqueEmployees(
      scheduleByMonth,
      remarksByEmployee,
      dataTipsForMonth
    );

    setSelectedData(employees);
  }, [uniqueKey]);

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
        </form>
      </Form>

      <EmployeeTables data={selectedData || []} />
    </>
  );
}
