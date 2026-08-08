"use client";

import {
  createAlgorithmData,
  getAlgorithmData,
} from "@/app/actions/algorithm/algorithm-actions";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Activity, useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import AlgorithmForm from "./algorithm-form";
import {
  AlgorithmData,
  algorithmSchema,
  defaultAlgorithm,
  defaultValues,
  FIELD_CONFIG,
} from "./schema";

export default function AlgorithmPage() {
  const tab = useSearchParams().get("tab");

  // state
  const { isEdit, setIsEdit } = useEdit();
  //form
  const form = useForm<AlgorithmData>({
    resolver: zodResolver(algorithmSchema),
    defaultValues: defaultAlgorithm,
  });

  const fieldArrays = Object.fromEntries(
    FIELD_CONFIG.map((name) => [
      name,
      useFieldArray({ control: form.control, name }),
    ]),
  );

  const onSubmit: SubmitHandler<AlgorithmData> = async (data) => {
    await createAlgorithmData(data);
    toast.success("Алгоритм успешно сохранён!");
    setIsEdit(false);
  };

  useEffect(() => {
    const load = async () => {
      const data = await getAlgorithmData();
      if (!data) return;
      const dataForm = {
        ...Object.fromEntries(
          FIELD_CONFIG.map((name) => [name, data[name] || [defaultValues]]),
        ),
      };
      if (data) form.reset(dataForm);
    };

    load();
  }, [form]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      {FIELD_CONFIG.map((name) => (
        <Activity key={name} mode={tab === name ? "visible" : "hidden"}>
          <AlgorithmForm
            fieldForm={fieldArrays[name]}
            fieldName={name}
            isEdit={isEdit}
          />
        </Activity>
      ))}
    </FormWrapper>
  );
}
