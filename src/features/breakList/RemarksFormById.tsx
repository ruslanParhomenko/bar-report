"use client";
import SelectField from "@/components/inputs/SelectField";
import SelectInput from "@/components/inputs/SelectInput";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { OVER_HOURS, REASON } from "./constant";
import NumericInput from "@/components/inputs/NumericInput";
import { AddRemoveFieldsButton } from "@/components/buttons/AddRemoveFieldsButton";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";
import { BreakRemarksData, defaultRemarks } from "./schema";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "@/i18n/navigation";
import TextInput from "@/components/inputs/TextInput";
import { toast } from "sonner";
import { useEmployees } from "@/providers/EmployeesProvider";
import { invalidateRemarks } from "@/app/actions/remarks/getRemarks";

export default function RemarksFormByIdClient() {
  const router = useRouter();
  const employees = useEmployees();
  //employees

  const selectedEmployees = employees?.map((employee) => ({
    label: employee.name,
    value: employee.name,
  }));
  const params = useParams();
  const id = params.id as string;

  const {
    data: remarksData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["remarks", id],
    queryFn: () => fetcher(`/api/remarks/${id}`),
    enabled: !!id,
  });

  const { updateMutation } = useApi<Omit<BreakRemarksData, "rows">>({
    endpoint: "remarks",
    queryKey: "archive",
    fetchInit: false,
  });

  const form = useForm<Omit<BreakRemarksData, "rows">>({
    defaultValues: { remarks: [defaultRemarks] },
  });
  const remarks = useFieldArray({
    control: form.control,
    name: "remarks",
  });

  const dataFormat =
    remarksData?.date && isValid(new Date(remarksData.date))
      ? format(new Date(remarksData.date), "dd.MM.yy")
      : "-";

  //submit
  const handleSubmit: SubmitHandler<Omit<BreakRemarksData, "rows">> = async (
    data
  ) => {
    console.log(data);
    if (!id) return;
    await updateMutation.mutate({ id, remarks: data.remarks });
    invalidateRemarks();
    toast.success("Remarks updated successfully");
    router.back();
  };
  useEffect(() => {
    if (remarksData?.remarks) {
      form.reset({ remarks: remarksData.remarks });
    }
  }, [remarksData, form]);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Label className="text-lg font-semibold text-bl table-fixed">
          Remarks: {dataFormat}
        </Label>
        <Table className="md:w-full">
          <TableHeader>
            <TableRow className="h-10">
              <TableCell className="text-center md:w-80 w-12"></TableCell>
              <TableCell className="text-center md:w-20 w-5">day</TableCell>
              <TableCell className="text-center md:w-20 w-5">night</TableCell>
              <TableCell className="text-center md:w-40 w-8">
                penality
              </TableCell>
              <TableCell className="text-center md:w-40 w-8">bonus</TableCell>
              <TableCell className="text-center md:w-90 w-8">reason</TableCell>
              <TableCell className="text-center md:w-40 w-5">actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {remarks.fields?.map((item: any, idx: number) => (
              <TableRow key={item.id}>
                <TableCell>
                  <SelectInput
                    fieldName={`remarks.${idx}.name`}
                    fieldLabel=""
                    data={selectedEmployees}
                  />
                </TableCell>
                <TableCell>
                  <SelectField
                    fieldName={`remarks.${idx}.dayHours`}
                    data={OVER_HOURS}
                  />
                </TableCell>
                <TableCell>
                  <SelectField
                    fieldName={`remarks.${idx}.nightHours`}
                    data={OVER_HOURS}
                  />
                </TableCell>
                <TableCell>
                  <NumericInput fieldName={`remarks.${idx}.penality`} />
                </TableCell>
                <TableCell>
                  <NumericInput fieldName={`remarks.${idx}.bonus`} />
                </TableCell>
                <TableCell>
                  <TextInput
                    fieldName={`remarks.${idx}.reason`}
                    // data={REASON}
                  />
                </TableCell>
                <TableCell>
                  <AddRemoveFieldsButton
                    formField={remarks}
                    defaultValues={defaultRemarks}
                    index={idx}
                    className="!gap-5"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          <Button type="submit" className="mt-4">
            Save
          </Button>
          <Button
            type="button"
            variant={"destructive"}
            className="mt-4 ml-4"
            onClick={() => router.back()}
          >
            return
          </Button>
        </div>
      </form>
    </Form>
  );
}
