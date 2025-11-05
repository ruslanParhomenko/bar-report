"use client";
import { useSchedules } from "@/providers/ScheduleProvider";
import { MONTHS } from "@/utils/getMonthDays";
import { useEffect,  useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { extractUniqueEmployees, getRemarksByMonth, ResultUniqueEmployeeType } from "./utils";

import { remarksByUniqueEmployee } from "../penalty/utils";
import { ResultBodyForm } from "./ResultBodyForm";
import { ResultHeaderForm } from "./ResultHeaderForm";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { resultDefaultValue, ResultFormType, resultSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";

export  function PageResult({
  dataTips,
  remarks,
}: {
  dataTips: any[];
  remarks: any;
}) {
  const schedules = useSchedules();
  // state schedule
  const [selectedData, setSelectedData] = useState<ResultUniqueEmployeeType[]>([]);

  // form
  const form = useForm<ResultFormType>({
    resolver:yupResolver(resultSchema),
    defaultValues: {
      ...resultDefaultValue,
      month:MONTHS[new Date().getMonth()],
      year:new Date().getFullYear().toString(),
    }
  });
  const month = useWatch({ control: form.control, name: "month" });
  const year = useWatch({ control: form.control, name: "year" });



  const setValueBid = (data: Partial<ResultFormType>) => {
    
    form.setValue("waitersDishBid", data.waitersDishBid as string);
    form.setValue("barmenDishBid", data.barmenDishBid as string);
    form.setValue("dishDishBid", data.dishDishBid as string);
    form.setValue("percentTips", data.percentTips as string);
  }

  
  useEffect(() => {
    if(!year && ! month) return
    
    // unique key
    const uniqueKey = `${year}-${month}`;

    // schedule
    const scheduleByMonth = schedules.filter((s) => {
      const select = s.uniqueKey.split("-")[0] + "-" + s.uniqueKey.split("-")[1];
      return select === uniqueKey;
    });

    // remarks
    const remarksByMonth = getRemarksByMonth(remarks, uniqueKey, MONTHS);
    const remarksByEmployee = remarksByUniqueEmployee(remarksByMonth).formattedData;

    // tips
    const dataTipItem = dataTips.find((item: any) => item.unique_id === uniqueKey);
    const dataTipsForMonth = dataTipItem?.form_data?.rowEmployeesTips || [];


    const employees = extractUniqueEmployees(
      scheduleByMonth,
      remarksByEmployee,
      dataTipsForMonth
    );

    setSelectedData(employees);
    setValueBid(dataTipItem?.form_data)
  }, [year, month]);

  return (
    
     <FormWrapper form={form}>

       <ResultHeaderForm/>
       <ResultBodyForm data={selectedData} />

     </FormWrapper>
    
  );
}
