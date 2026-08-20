"use client";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { PenaltyPage } from "@/features/penalty";
import { createPenalty } from "@/features/penalty/actions/create-penalty";
import {
  remarkDefault,
  RemarksForm,
  remarksSchema,
} from "@/features/penalty/model/schema";
import { GetRemarksData } from "@/features/penalty/model/type";
import { Employee } from "@/features/settings/create-employee/model/type";
import { useRouter } from "@/i18n/navigation";
import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type PenaltyFormData = {
  penalty: RemarksForm;
};

const penaltyFormSchema = z.object({
  penalty: remarksSchema,
});
export default function PenaltyUpdate({
  dataPenaltyByDay,
  employees,
  month,
  year,
  day,
}: {
  dataPenaltyByDay: GetRemarksData;
  employees: Employee[];
  month: string;
  year: string;
  day: string;
}) {
  const { role } = useAbility();

  const { setIsEdit } = useEdit();

  const router = useRouter();

  const formData = {
    penalty: {
      remarks: dataPenaltyByDay.remarks.length
        ? dataPenaltyByDay.remarks
        : [remarkDefault],
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

  if (role !== "ADMIN") return <InsufficientRights />;

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <PenaltyPage day={day} employees={employees} />
    </FormWrapper>
  );
}
