"use client";

import {
  createAlgorithmData,
  getAlgorithmData,
} from "@/app/actions/algorithm/algorithm-actions";
import EditButton from "@/components/buttons/edit-button";
import SaveButton from "@/components/buttons/save-button";
import { Form } from "@/components/ui/form";
import { useHashParam } from "@/hooks/use-hash";
import { useAbility } from "@/providers/ability-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, useEffect, useState } from "react";
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
  const { isAdmin } = useAbility();
  const [tab] = useHashParam("tab");

  // state
  const [isEdit, setIsEdit] = useState(false);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="overflow-auto h-[95vh]">
          <div className="flex w-full items-center gap-4 p-3 sticky top-0 bg-background z-10">
            <EditButton
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              disabled={!isAdmin}
            />
            <SaveButton isEdit={isEdit} disabled={!isEdit} />
          </div>
          {FIELD_CONFIG.map((name) => (
            <Activity key={name} mode={tab === name ? "visible" : "hidden"}>
              <AlgorithmForm
                fieldForm={fieldArrays[name]}
                fieldName={name}
                isEdit={isEdit}
              />
            </Activity>
          ))}
        </div>
      </form>
    </Form>
  );
}
