"use client";

import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  createRemarks,
  updateRemark,
} from "@/app/actions/remarks/remarksAction";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { defaultRemarksValue, RemarksFormData, remarksSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { RemarksTable } from "./RemarksTable";
import { useRemarks } from "@/providers/RemarksProvider";
import { useEffect } from "react";
import { REMARKS_ENDPOINT } from "@/constants/endpoint-tag";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { SaveRemarkById } from "./SaveRemarkById";

export function RemarksForm() {
  const router = useRouter();
  const params = useParams();

  // set data by id
  const data = useRemarks();
  const id = params.id as string;

  const key = id ? "edit-remarks" : REMARKS_ENDPOINT;
  const dataRemarksById = id && data.find((el) => el.id.toString() === id);

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
    <FormWrapper form={form} onSubmit={onSubmit}>
      <RemarksTable />
      {id && <SaveRemarkById />}
    </FormWrapper>
  );
}
