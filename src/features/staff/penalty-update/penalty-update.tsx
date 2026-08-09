"use client";

import { useRouter } from "@/i18n/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { remarkDefault, RemarksForm, remarksSchema } from "../bar/penalty/model/schema";
import { PenaltyPage } from "../bar/penalty";
import { createPenalty } from "../bar/penalty/actions/create-penalty";

type PenaltyFormData = {
  penalty: RemarksForm;
};

const penaltyFormSchema = z.object({
  penalty: remarksSchema,
});
export default function PenaltyUpdate({
  data,
  month,
  year,
  day,
}: {
  data: any;
  month: string;
  year: string;
  day: string;
}) {
  const { isAdmin, isBar, isManager } = useAbility();
  const isDisabled = !isAdmin && !isBar && !isManager;

  const { setIsEdit } = useEdit();

  const router = useRouter();

  const formData = {
    penalty: {
      remarks: data.remarks.length ? data.remarks : [remarkDefault],
    },
  };

  const form = useForm<PenaltyFormData>({
    resolver: zodResolver(penaltyFormSchema),
    defaultValues: formData,
  });

  //submit
  const onSubmit: SubmitHandler<PenaltyFormData> = async (data) => {
    const formattedData = {
      day,
      month,
      year,
      remarks: data.penalty,
    };
    await createPenalty(formattedData);

    toast.success("Журнал успешно обновлен!");
    setIsEdit(false);
    router.push(`/archive?month=${month}&year=${year}#tab=penalty`);
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <PenaltyPage isDisabled={isDisabled} day={day} />
    </FormWrapper>
  );
}
