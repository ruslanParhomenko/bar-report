"use client";

import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { formatNowData } from "@/utils/format-date";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import { createStopList } from "../actions/create-stop-list";
import {
  defaultStopListSchema,
  stopListSchema,
  StopListSchemaType,
} from "../model/schema";

export function useStopListForm(data: StopListSchemaType | null) {
  const { isBar, isAdmin, isCucina } = useAbility();
  const { setIsEdit } = useEdit();

  const canEdit = isBar || isAdmin || isCucina;

  const form = useForm<StopListSchemaType>({
    resolver: zodResolver(stopListSchema),
    defaultValues: defaultStopListSchema,
    mode: "onBlur",
  });

  const stopListFieldArray = useFieldArray({
    control: form.control,
    name: "stopList",
  });

  const watchStopList = useWatch({
    control: form.control,
    name: "stopList",
  });

  useEffect(() => {
    watchStopList?.forEach((item, idx) => {
      if (item?.product && !item.date) {
        const date = formatNowData();
        const author =
          (isBar && "bar") ||
          (isCucina && "cucina") ||
          (isAdmin && "admin") ||
          "";
        stopListFieldArray.update(idx, {
          ...stopListFieldArray.fields[idx],
          ...item,
          date,
          author,
        });
      }
    });
  }, [watchStopList, stopListFieldArray, isBar, isCucina, isAdmin]);

  // Загрузка данных
  useEffect(() => {
    if (!data) return;
    form.reset(data);
  }, [data, form]);

  const onSubmit: SubmitHandler<StopListSchemaType> = async (formData) => {
    if (!canEdit) {
      toast.error("You do not have permission to edit the stop list.");
      return;
    }
    await createStopList(formData);
    toast.success("Stop list saved successfully!");
    setIsEdit(false);
  };

  return {
    form,
    stopListFieldArray,
    onSubmit,
    canEdit,
  };
}
