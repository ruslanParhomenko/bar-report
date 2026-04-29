"use client";

import {
  RemarksData,
  updateRemarks,
} from "@/app/actions/remarks/remarks-action";
import { useRouter } from "@/i18n/navigation";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import PenaltyTable from "@/features/bar/penalty/penalty-table";
import {
  defaultRemarkValue,
  RemarksFormData,
  remarksSchema,
} from "@/features/bar/penalty/schema";
import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import z from "zod";

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
  const pathname = usePathname();
  const formId = pathname.split("/")[1] || "";

  const { isAdmin, isBar, isManager } = useAbility();
  const isDisabled = !isAdmin && !isBar && !isManager;

  const { setIsEdit } = useEdit();

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
    setIsEdit(false);
    router.push(`/archive?month=${month}&year=${year}#tab=penalty`);
  };

  useEffect(() => {
    setIsEdit(true);
    return () => {
      setIsEdit(false);
    };
  }, [setIsEdit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId}>
        <PenaltyTable isDisabled={isDisabled} day={day} />
      </form>
    </Form>
  );
}
