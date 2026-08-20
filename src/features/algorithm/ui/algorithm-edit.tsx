import FormWrapper from "@/components/wrapper/form-wrapper";
import { Activity } from "react";
import { useFieldArray } from "react-hook-form";
import { useAlgoritmForm } from "../hooks/use-algorithm-form";
import { AlgorithmData, FIELD_CONFIG } from "../model/schema";
import AlgorithmForm from "./algorithm-form";

export default function AlgorithmEdit({
  data,
  tab,
}: {
  data: AlgorithmData | null;
  tab: string;
}) {
  const { form, onSubmit } = useAlgoritmForm({ data });
  const fieldArrays = Object.fromEntries(
    FIELD_CONFIG.map((name) => [
      name,
      useFieldArray({ control: form.control, name }),
    ]),
  );
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      {FIELD_CONFIG.map((name) => (
        <Activity key={name} mode={tab === name ? "visible" : "hidden"}>
          <AlgorithmForm fieldForm={fieldArrays[name]} fieldName={name} />
        </Activity>
      ))}
    </FormWrapper>
  );
}
