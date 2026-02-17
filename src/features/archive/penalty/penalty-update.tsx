"use client";

import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  RemarksData,
  updateRemarks,
} from "@/app/actions/remarks/remarks-action";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAbility } from "@/providers/ability-provider";
import z from "zod";
import FormInput from "@/components/wrapper/form";
import {
  defaultRemarkValue,
  RemarksFormData,
  remarksSchema,
} from "@/features/bar/penalty/schema";
import PenaltyTable from "@/features/bar/penalty/penalty-table";

type PenaltyFormData = {
  penalty: RemarksFormData;
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
  data: RemarksData;
  month: string;
  year: string;
  day: string;
}) {
  const { isAdmin, isBar, isManager } = useAbility();
  const isDisabled = !isAdmin && !isBar && !isManager;

  const router = useRouter();

  const formData = {
    penalty: {
      remarks: data.remarks.length ? data.remarks : [defaultRemarkValue],
    },
  };

  const form = useForm<PenaltyFormData>({
    resolver: zodResolver(penaltyFormSchema) as Resolver<PenaltyFormData>,
    defaultValues: formData,
  });

  //submit
  const onSubmit: SubmitHandler<PenaltyFormData> = async (data) => {
    const dbUniqueKey = `${year}-${month}`;
    await updateRemarks(dbUniqueKey, day, data.penalty.remarks);

    toast.success("Журнал успешно обновлен!");
    router.back();
  };

  return (
    <FormInput
      form={form}
      onSubmit={onSubmit}
      returnButton={true}
      withButtons={!isDisabled}
    >
      <PenaltyTable isDisabled={isDisabled} day={day} />
    </FormInput>
  );
}
