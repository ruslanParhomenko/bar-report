"use client";
import TextInput from "@/components/inputs/TextInput";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { defaultUser, usersSchema, UsersSchemaTypeData } from "./schema";
import { useAbility } from "@/providers/AbilityProvider";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUser, updateUser } from "@/app/actions/users/userAction";
import { toast } from "sonner";
import { useEffect } from "react";

import { useRouter } from "next/navigation";
import SelectField from "@/components/inputs/SelectField";
import { Label } from "@/components/ui/label";

const ROLES = ["ADMIN", "BAR", "CUCINA", "USER", "MNGR", "CASH", "FIN"];

type FormData = UsersSchemaTypeData;

export default function UsersForm({ id }: { id?: string }) {
  const router = useRouter();
  const t = useTranslations("Home");

  const { query: users } = useAbility();
  const userData = id && users.find((u: any) => u.id === id);

  const form = useForm<FormData>({
    resolver: yupResolver(usersSchema),
    defaultValues: defaultUser,
  });

  const { reset: resetForm } = form;

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (data.id) {
        await updateUser(data.id, {
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
      router.refresh();
    } catch (e) {
      toast.error("Error adding user");
    }
  };
  useEffect(() => {
    if (!id && !userData) return;

    form.reset(userData as FormData);
  }, [id]);
  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      className="md:w-1/2"
      resetForm={resetForm}
      resetButton={id ? false : true}
      returnButton={id ? true : false}
    >
      <div className="mt-6">
        <TextInput
          fieldName="mail"
          fieldLabel={t("mail")}
          type="mail"
          className="w-full h-10"
        />
        <Label className="my-3">{t("role")}</Label>
        <SelectField
          data={ROLES}
          fieldName="role"
          className="truncate w-full h-10!"
        />
      </div>
    </FormWrapper>
  );
}
