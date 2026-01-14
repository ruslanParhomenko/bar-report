"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  createRemarks,
  RemarksData,
  updateRemark,
} from "@/app/actions/remarks/remarksAction";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { defaultRemarksValue, RemarksFormData, remarksSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { REMARKS_ENDPOINT } from "@/constants/endpoint-tag";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { Table } from "@/components/ui/table";
import { PenaltyTableHeader } from "./penalty-header";
import { PenaltyTableBody } from "./penalty-body";

export default function PenaltyForm({
  dataRemark,
}: {
  dataRemark?: RemarksData;
}) {
  const router = useRouter();

  const id = dataRemark?.id ? String(dataRemark.id) : null;
  const key = dataRemark?.id ? "edit-remarks" : REMARKS_ENDPOINT;
  const dataRemarksById = dataRemark ? dataRemark : null;

  // form
  const form = useForm<RemarksFormData>({
    resolver: yupResolver(remarksSchema),
    defaultValues: defaultRemarksValue,
  });

  // localstorage
  const { isLoaded, resetForm } = useLocalStorageForm(form, key);

  //submit
  const onSubmit: SubmitHandler<RemarksFormData> = async (data) => {
    if (id) {
      await updateRemark({
        id,
        remarks: data.remarks,
      });
      toast.success("Журнал успешно обновлен!");
      router.back();
    } else {
      await createRemarks(data);
      toast.success("Журнал успешно сохранён!");
      resetForm(defaultRemarksValue);
    }
  };

  // reset dat by id
  useEffect(() => {
    if (dataRemarksById) {
      form.reset({
        remarks: dataRemarksById.remarks,
        date: dataRemarksById.date,
      });
    }
  }, [id]);

  if (!isLoaded) return null;

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      returnButton={id ? true : false}
      resetButton={id ? false : true}
      resetForm={form.reset}
    >
      <Table className="md:table-fixed mt-6">
        <PenaltyTableHeader />
        <PenaltyTableBody />
      </Table>
    </FormWrapper>
  );
}
