"use client";

import { Resolver, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  createRemarks,
  realtimeRemarksList,
  RemarksData,
  updateRemarks,
} from "@/app/actions/remarks/remarks-action";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import {
  defaultRemarksValue,
  RemarksFormData,
  remarksSchema,
} from "../bar/penalty/schema";
import { useEffect } from "react";
import { Table } from "@/components/ui/table";
import { PenaltyTableHeader } from "../bar/penalty/penalty-header";
import { PenaltyTableBody } from "../bar/penalty/penalty-body";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildDate, MONTHS } from "@/utils/getMonthDays";
import { useAbility } from "@/providers/AbilityProvider";
import PenaltyTable from "../bar/penalty/penalty-table";

export default function PenaltyForm({
  dataRemark,
  month,
  year,
  realtimeData,
}: {
  dataRemark?: RemarksData;
  month?: string;
  year?: string;
  realtimeData?: RemarksFormData;
}) {
  const { isAdmin, isBar, isManager } = useAbility();
  const isDisabled = !isAdmin && !isBar && !isManager;

  const router = useRouter();
  const dayId = dataRemark?.day ? String(dataRemark.day) : null;
  const dataRemarksById = dataRemark ? dataRemark : null;

  // form
  const form = useForm<RemarksFormData>({
    resolver: zodResolver(remarksSchema) as Resolver<RemarksFormData>,
    defaultValues: realtimeData
      ? { date: new Date(realtimeData.date), remarks: realtimeData.remarks }
      : defaultRemarksValue,
  });

  const rowRemarks = useWatch({
    control: form.control,
    name: "remarks",
  });

  useEffect(() => {
    if (!isBar) return;
    const timeoutRef = { current: null as NodeJS.Timeout | null };

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const data = form.getValues() as RemarksFormData;

      realtimeRemarksList(data).catch(console.error);
    }, 6000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [rowRemarks]);
  //submit
  const onSubmit: SubmitHandler<RemarksFormData> = async (data) => {
    const date = new Date(data.date);
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear().toString();
    const day = date.getDate().toLocaleString();
    const uniqueKey = `${year}-${month}`;
    const formattedData = {
      remarks: data.remarks,
      uniqueKey: uniqueKey,
      month: month,
      year: year,
      day: day,
    };

    if (dayId) {
      const dbUniqueKey = `${year}-${month}`;
      await updateRemarks(dbUniqueKey, dayId, data.remarks);

      toast.success("Журнал успешно обновлен!");
      router.back();
    } else {
      await createRemarks(uniqueKey, formattedData);
      form.reset({ ...defaultRemarksValue, date: new Date() });
      toast.success("Журнал успешно сохранён!");
    }
  };

  // reset dat by id
  useEffect(() => {
    if (!dataRemarksById || !month || !year || !dayId) return;

    const date = buildDate({
      year: Number(year),
      month: month,
      day: dataRemarksById.day,
    });

    form.reset({
      remarks: dataRemarksById.remarks,
      date: date,
    });
  }, [dayId]);

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      returnButton={dayId ? true : false}
      withButtons={!isDisabled}
    >
      <PenaltyTable />
    </FormWrapper>
  );
}
