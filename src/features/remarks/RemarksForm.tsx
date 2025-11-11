"use client";

import { useParams } from "next/navigation";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  createRemarks,
  updateRemark,
} from "@/app/actions/remarks/remarksAction";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import {
  defaultRemarksValue,
  defaultRemarkValue,
  RemarksFormData,
  remarksSchema,
} from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { RemarksTable } from "./RemarksTable";
import { useRemarks } from "@/providers/RemarksProvider";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { REMARKS_ENDPOINT } from "@/constants/endpoint-tag";
import { useLocalStorageForm } from "@/hooks/use-local-storage";

export function RemarksForm() {
  const LOCAL_STORAGE_KEY = REMARKS_ENDPOINT;

  const params = useParams();
  const router = useRouter();

  // set data by id
  const data = useRemarks();
  const id = params.id as string;
  const dataRemarksById = id && data.find((el) => el.id.toString() === id);

  //localstorage
  const { getValue, setValue } =
    useLocalStorageForm<RemarksFormData>(LOCAL_STORAGE_KEY);

  const parsedSavedData = getValue() ?? {
    date: new Date(),
    remarks: [defaultRemarkValue],
  };

  // form
  const form = useForm<RemarksFormData>({
    resolver: yupResolver(remarksSchema),
    defaultValues: parsedSavedData,
  });

  const fieldsArray = useFieldArray({
    control: form.control,
    name: "remarks",
  });

  const watchAllFields = useWatch({
    control: form.control,
  });

  //submit
  const onSubmit: SubmitHandler<RemarksFormData> = async (data) => {
    if (id) {
      await updateRemark({
        id,
        remarks: data.remarks,
      });
      toast.success("Remarks updated successfully");
      router.back();
    } else {
      await createRemarks(data);
      toast.success("Remarks created successfully");
      form.reset(defaultRemarksValue);
    }
  };

  // set localstorage
  useEffect(() => {
    if (!watchAllFields) return;
    setValue(watchAllFields as RemarksFormData);
  }, [watchAllFields]);

  // reset dat by id
  useEffect(() => {
    if (dataRemarksById) {
      form.reset({
        remarks: dataRemarksById.remarks,
        date: dataRemarksById.date,
      });
    }
  }, [id]);
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <RemarksTable
        dataRemarks={fieldsArray.fields}
        append={fieldsArray.append}
        remove={fieldsArray.remove}
        form={form}
      />
      {id && (
        <div>
          <Button type="submit" className="mt-4">
            Save
          </Button>
          <Button
            type="button"
            variant={"destructive"}
            className="mt-4 ml-4"
            onClick={() => router.back()}
          >
            return
          </Button>
        </div>
      )}
    </FormWrapper>
  );
}
