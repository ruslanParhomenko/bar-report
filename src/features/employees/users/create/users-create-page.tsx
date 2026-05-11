"use client";
import { createUser, updateUser } from "@/app/actions/users/user-action";
import SelectField from "@/components/input-controlled/select-field";
import SwitchInput from "@/components/input-controlled/switch-input";
import TextInput from "@/components/input-controlled/text-input";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { ROUTES } from "@/constants/routes";
import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { defaultUser, usersSchema, UsersSchemaTypeData } from "./schema";

const ROLES = ["ADMIN", "BAR", "CUCINA", "USER", "MNGR", "CASH", "FIN", "SCR"];

type FormData = UsersSchemaTypeData;

export default function UsersCreatePage({ id }: { id?: string }) {
  const { setIsEdit, registerReset } = useEdit();
  const router = useRouter();
  const t = useTranslations("Home");
  const { users } = useAbility();
  const user = id ? users?.find((u) => u.id === id) : undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(usersSchema),
    defaultValues: user ? { ...defaultUser, ...user } : defaultUser,
  });

  // Watch accessList to derive boolean state for each route switch
  const accessList = useWatch({ control: form.control, name: "accessList" });

  const handleRouteToggle = (route: string, checked: boolean) => {
    const current = form.getValues("accessList");
    const updated = checked
      ? [...current, route]
      : current.filter((r) => r !== route);
    form.setValue("accessList", updated, { shouldValidate: true });
  };

  useEffect(() => {
    if (user) {
      form.reset({ ...defaultUser, ...user });
    }
  }, [user]);

  useEffect(() => {
    setIsEdit(true);
    registerReset(form.reset);
  }, []);

  const returnUrl = "/employees#tab=users";

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (id) {
        await updateUser(id, {
          mail: data.mail,
          role: data.role,
          name: data.name,
          status: data.status,
          accessList: data.accessList,
        });
        toast.success("User is updated !");
      } else {
        await createUser({
          mail: data.mail,
          role: data.role,
          name: data.name,
          status: data.status,
          accessList: data.accessList,
        });
        toast.success("User is added !");
      }
    } catch (e) {
      toast.error("Error adding user");
    }

    setIsEdit(false);
    router.replace(returnUrl);
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <div className="mt-6 flex flex-col gap-4 px-4">
        <TextInput
          fieldName="mail"
          fieldLabel={t("mail")}
          type="mail"
          className="h-10 w-full"
        />
        <SelectField
          fieldLabel={t("role")}
          data={ROLES}
          fieldName="role"
          className="h-10 w-full truncate"
        />
        <TextInput
          fieldName="name"
          fieldLabel={t("name")}
          type="text"
          className="h-10 w-full"
        />
        <SwitchInput fieldName="status" fieldLabel={t("status")} />

        <div className="grid w-full grid-cols-2 justify-between gap-1 md:h-1/5 md:grid-cols-6 md:gap-4">
          {ROUTES.map((route) => (
            <SwitchInput
              key={route}
              fieldName={route}
              fieldLabel={route}
              checked={accessList?.includes(route) ?? false}
              onCheckedChange={(checked) => handleRouteToggle(route, checked)}
            />
          ))}
        </div>
      </div>
    </FormWrapper>
  );
}
