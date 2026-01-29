"use client";

import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  createRemarks,
  RemarksData,
  updateRemarks,
} from "@/app/actions/remarks/remarks-action";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { defaultRemarksValue, RemarksFormData, remarksSchema } from "./schema";
import { useEffect } from "react";
import { REMARKS_MAIN_ROUTE } from "@/constants/endpoint-tag";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { Table } from "@/components/ui/table";
import { PenaltyTableHeader } from "./penalty-header";
import { PenaltyTableBody } from "./penalty-body";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildDate, MONTHS } from "@/utils/getMonthDays";

export default function PenaltyForm({
  dataRemark,
  month,
  year,
}: {
  dataRemark?: RemarksData;
  month?: string;
  year?: string;
}) {
  const router = useRouter();
  const dayId = dataRemark?.day ? String(dataRemark.day) : null;
  const key = dataRemark?.day ? "edit-remarks" : REMARKS_MAIN_ROUTE;
  const dataRemarksById = dataRemark ? dataRemark : null;

  // form
  const form = useForm<RemarksFormData>({
    resolver: zodResolver(remarksSchema) as Resolver<RemarksFormData>,
    defaultValues: defaultRemarksValue,
  });

  // localstorage
  const { isLoaded, resetForm } = useLocalStorageForm(form, key);

  //submit
  const onSubmit: SubmitHandler<RemarksFormData> = async (data) => {
    const month = MONTHS[new Date(data.date).getMonth()];
    const year = new Date(data.date).getFullYear().toString();
    const day = new Date(data.date).getDate().toLocaleString();
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
      toast.success("Журнал успешно сохранён!");
      resetForm(defaultRemarksValue);
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

  if (!isLoaded) return null;

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      returnButton={dayId ? true : false}
      resetButton={dayId ? false : true}
      resetForm={form.reset}
    >
      <Table className="md:table-fixed mt-6">
        <PenaltyTableHeader isUpdate={!!dayId} />
        <PenaltyTableBody />
      </Table>
    </FormWrapper>
  );
}
