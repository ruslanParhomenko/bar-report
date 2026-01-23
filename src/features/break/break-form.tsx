"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { BREAK_MAIN_ROUTE } from "@/constants/endpoint-tag";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { toast } from "sonner";
import { BreakFormData, breakSchema, defaultValuesBrake } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorageForm } from "@/hooks/useLocalStorageForm";
import { Table } from "@/components/ui/table";
import BreakTableHeader from "./break-header";
import BreakTableBody from "./break-body";
import { createBreakList } from "@/app/actions/break/break-action";

export default function BreakForm() {
  // form
  const form = useForm<BreakFormData>({
    resolver: zodResolver(breakSchema),
    defaultValues: defaultValuesBrake,
    mode: "onSubmit",
    reValidateMode: "onBlur",
    shouldUnregister: false,
  });

  // localstorage
  const { isLoaded, resetForm } = useLocalStorageForm(form, BREAK_MAIN_ROUTE);
  // submit
  const onSubmit: SubmitHandler<BreakFormData> = async (data) => {
    try {
      await createBreakList(data);
      toast.success("Брейк-лист успешно сохранён !");
      resetForm({ ...defaultValuesBrake, date: new Date().toISOString() });
    } catch (e) {
      toast.error("Ошибка при сохранении брейк-листа");
    }
  };

  if (!isLoaded)
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <FormWrapper
      form={form}
      onSubmit={onSubmit}
      resetButton={true}
      resetForm={form.reset}
    >
      <Table className="md:table-fixed mt-6">
        <BreakTableHeader />
        <BreakTableBody />
      </Table>
    </FormWrapper>
  );
}
