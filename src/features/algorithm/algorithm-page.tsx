"use client";

import {
  createAlgorithmData,
  getAlgorithmData,
} from "@/app/actions/algorithm/algorithm-actions";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useHashParam } from "@/hooks/use-hash";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import AlgorithmForm from "./algorithm-form";
import { AlgorithmData, algorithmSchema, defaultAlgorithm } from "./schema";

const FIELD_CONFIG = [
  "tips",
  "cash",
  "shifts",
  "vip",
  "algorithm",
  "workflow",
] as const;

export default function AlgorithmPage() {
  const [tab] = useHashParam("tab");

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
      if (data) form.reset(data);
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
