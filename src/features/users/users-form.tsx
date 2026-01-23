"use client";
import TextInput from "@/components/inputs/TextInput";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { defaultUser, usersSchema, UsersSchemaTypeData } from "./schema";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { createUser, updateUser } from "@/app/actions/users/userAction";
import { toast } from "sonner";
import { useEffect } from "react";

import { useRouter } from "next/navigation";
import SelectField from "@/components/inputs/SelectField";
import { zodResolver } from "@hookform/resolvers/zod";

const ROLES = ["ADMIN", "BAR", "CUCINA", "USER", "MNGR", "CASH", "FIN"];

type FormData = UsersSchemaTypeData;

export default function UsersForm({ data }: { data?: FormData }) {
  const id = data?.id;
  const router = useRouter();
  const t = useTranslations("Home");

  const form = useForm<FormData>({
    resolver: zodResolver(usersSchema),
    defaultValues: data ? usersSchema.parse(data) : defaultUser,
  });

  const { reset: resetForm } = form;

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (id) {
        await updateUser(id, {
          mail: data.mail,
          role: data.role,
        });

        toast.success("User is updated !");
      } else {
        await createUser({
          mail: data.mail,
          role: data.role,
        });

        toast.success("User is added !");
      }
      resetForm();
      router.back();
    } catch (e) {
      toast.error("Error adding user");
    }
  };
  useEffect(() => {
    if (!data) return;

    form.reset(data as FormData);
  }, [data]);
  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      className="md:w-1/2"
      resetForm={resetForm}
      resetButton={id ? false : true}
      returnButton={id ? true : false}
    >
      <div className="mt-6 flex flex-col gap-4">
        <TextInput
          fieldName="mail"
          fieldLabel={t("mail")}
          type="mail"
          className="w-full h-12"
        />
        <SelectField
          fieldLabel={t("role")}
          data={ROLES}
          fieldName="role"
          className="truncate w-full h-12!"
        />
      </div>
    </FormWrapper>
  );
}
