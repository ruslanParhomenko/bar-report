"use client";
import SelectField from "@/components/inputs/SelectField";
import { Form } from "@/components/ui/form";
import { useSchedules } from "@/providers/ScheduleProvider";
import { MONTHS, YEAR } from "@/utils/getMonthDays";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { extractUniqueEmployees, getRemarksByMonth } from "./utils";

import { remarksByUniqueEmployee } from "../penalty/utils";
import EmployeeTables from "./ResultTableByData";
import TextInput from "@/components/inputs/TextInput";

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

  const form = useForm({
    defaultValues: {
      month: MONTHS[new Date().getMonth()],
      year: new Date().getFullYear().toString(),
      waitersDishBid: "",
      barmenDishBid: "",
      dishDishBid: "",
      percentTips: "",
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

    form.setValue("waitersDishBid", dataTipItem?.form_data?.waitersDishBid);
    form.setValue("barmenDishBid", dataTipItem?.form_data?.barmenDishBid);
    form.setValue("dishDishBid", dataTipItem?.form_data?.dishDishBid);
    form.setValue("percentTips", dataTipItem?.form_data?.percentTips);
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
        <form className="w-full">
          <div className="flex flex-col justify-between">
            <div className="flex gap-4 justify-start items-center">
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
              <div className="flex gap-4 justify-start items-center">
                <TextInput fieldName="waitersDishBid" className="w-15 h-8" />
                <TextInput fieldName="barmenDishBid" className="w-15 h-8" />
                <TextInput fieldName="dishDishBid" className="w-15 h-8" />
                <TextInput fieldName="percentTips" className="w-15 h-8" />
              </div>
            </div>
          </div>
          <EmployeeTables data={selectedData || []} />
        </form>
      </Form>
    </>
  );
}
