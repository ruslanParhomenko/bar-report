"use client";

import FormInput from "@/components/wrapper/form";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlgorithmData, algorithmSchema, defaultAlgorithm } from "./schema";
import { useHashParam } from "@/hooks/use-hash";
import { Activity, useEffect, useTransition } from "react";
import { useAbility } from "@/providers/ability-provider";
import {
  createAlgorithmData,
  getAlgorithmData,
} from "@/app/actions/algorithm/algorithm-actions";
import AlgorithmForm from "./algorithm-form";

export default function AlgorithmPage() {
  const { isAdmin } = useAbility();
  const [tab] = useHashParam("tab");
  const form = useForm<AlgorithmData>({
    resolver: zodResolver(algorithmSchema),
    defaultValues: defaultAlgorithm,
  });

  const tipsFields = useFieldArray({ control: form.control, name: "tips" });
  const cashFields = useFieldArray({ control: form.control, name: "cash" });
  const shiftsFields = useFieldArray({ control: form.control, name: "shifts" });
  const vipFields = useFieldArray({ control: form.control, name: "vip" });
  const algorithmFields = useFieldArray({
    control: form.control,
    name: "algorithm",
  });
  const workflowFields = useFieldArray({
    control: form.control,
    name: "workflow",
  });

  const submit: SubmitHandler<AlgorithmData> = async (data) => {
    await createAlgorithmData(data);
  };

  const [_isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getAlgorithmData();
      if (data) form.reset(data);
    });
  }, [form]);
  return (
    <FormInput form={form} onSubmit={submit} withButtons={isAdmin}>
      <Activity mode={tab === "tips" ? "visible" : "hidden"}>
        <AlgorithmForm fieldForm={tipsFields} fieldName="tips" />
      </Activity>
      <Activity mode={tab === "cash" ? "visible" : "hidden"}>
        <AlgorithmForm fieldForm={cashFields} fieldName="cash" />
      </Activity>
      <Activity mode={tab === "shifts" ? "visible" : "hidden"}>
        <AlgorithmForm fieldForm={shiftsFields} fieldName="shifts" />
      </Activity>
      <Activity mode={tab === "vip" ? "visible" : "hidden"}>
        <AlgorithmForm fieldForm={vipFields} fieldName="vip" />
      </Activity>
      <Activity mode={tab === "algorithm" ? "visible" : "hidden"}>
        <AlgorithmForm fieldForm={algorithmFields} fieldName="algorithm" />
      </Activity>
      <Activity mode={tab === "workflow" ? "visible" : "hidden"}>
        <AlgorithmForm fieldForm={workflowFields} fieldName="workflow" />
      </Activity>
    </FormInput>
  );
}
