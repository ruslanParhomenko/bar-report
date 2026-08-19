"use client";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Activity } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAlgorithmData } from "../actions/create-algorithm";
import {
  AlgorithmData,
  algorithmSchema,
  defaultAlgorithm,
  FIELD_CONFIG,
} from "../model/schema";
import AlgorithmForm from "./algorithm-form";

export function AlgorithmPage({ data }: { data: AlgorithmData | null }) {
  const tab = useSearchParams().get("tab");

  const { isEdit, setIsEdit } = useEdit();

  const form = useForm<AlgorithmData>({
    resolver: zodResolver(algorithmSchema),
    defaultValues: data || defaultAlgorithm,
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
