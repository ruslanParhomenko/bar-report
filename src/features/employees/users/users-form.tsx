"use client";
import TextInput from "@/components/inputs/text-input";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";

import { createUser, updateUser } from "@/app/actions/users/user-action";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import SelectField from "@/components/inputs/select-input";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/wrapper/form";
import { useAbility } from "@/providers/ability-provider";
import { defaultUser, usersSchema, UsersSchemaTypeData } from "./schema";

const ROLES = ["ADMIN", "BAR", "CUCINA", "USER", "MNGR", "CASH", "FIN", "SCR"];

type FormData = UsersSchemaTypeData;

export default function UsersForm({ id }: { id?: string }) {
  const { isAdmin } = useAbility();

  const router = useRouter();
  const t = useTranslations("Home");

  const { users } = useAbility();
  const user = id ? users?.find((u) => u.id === id) : undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(usersSchema),
    defaultValues: user || defaultUser,
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

  return (
    <FormInput
      form={form}
      onSubmit={handleSubmit}
      className="md:w-1/2 px-1"
      resetButton={id ? false : true}
      returnButton={id ? true : false}
      disabled={!isAdmin}
    >
      <div className="mt-6 flex flex-col gap-4">
        <TextInput
          fieldName="mail"
          fieldLabel={t("mail")}
          type="mail"
          className="w-full h-10"
        />
        <SelectField
          fieldLabel={t("role")}
          data={ROLES}
          fieldName="role"
          className="truncate w-full h-10"
        />
      </div>
    </FormInput>
  );
}
