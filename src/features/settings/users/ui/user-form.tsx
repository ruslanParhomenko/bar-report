"use client";

import SelectField from "@/components/input-controlled/select-field";
import SwitchInput from "@/components/input-form/switch-input";
import TextInput from "@/components/input-form/text-input";
import { Separator } from "@/components/ui/separator";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { ROUTES } from "@/constants/routes";
import { TABS_KEY_ROUTE } from "@/constants/tabs";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { createUser } from "../actions/create-user";
import { GetUserData } from "../actions/get-users";
import { updateUser } from "../actions/update-user";
import { defaultUser, UserForm, usersSchema } from "../model/schema";

const ROLES = [
  "ADMIN",
  "BAR",
  "CUCINA",
  "USER",
  "MNGR",
  "CASH",
  "FIN",
  "SCR",
  "TECH",
];

type FormData = UserForm;

export function UserFormPage({
  id,
  users,
}: {
  id?: string;
  users: GetUserData[];
}) {
  const { setIsEdit, registerReset } = useEdit();
  const router = useRouter();
  const t = useTranslations("Home");

  const user = id ? users?.find((u) => u.id === id) : undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(usersSchema),
    defaultValues: user || defaultUser,
  });

  const accessList = useWatch({ control: form.control, name: "accessList" });

  const accessTabs = useWatch({ control: form.control, name: "accessTabs" });

  const handleRouteToggle = (route: string, checked: boolean) => {
    const current = form.getValues("accessList") || [];
    const updated = checked
      ? [...current, route]
      : current.filter((r) => r !== route);
    form.setValue("accessList", updated, { shouldValidate: true });
  };

  const handleTabToggle = (tab: string, checked: boolean) => {
    const current = form.getValues("accessTabs") || [];

    const updated = checked
      ? current.includes(tab)
        ? current
        : [...current, tab]
      : current.filter((item) => item !== tab);

    form.setValue("accessTabs", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (id) {
        await updateUser(id, data);
        toast.success("User is updated !");
      } else {
        await createUser(data);
        toast.success("User is added !");
      }
    } catch (e) {
      toast.error("Error adding user");
    }

    setIsEdit(false);
    router.back();
  };

  console.log(TABS_KEY_ROUTE);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <div className="mt-6 flex flex-col gap-6 px-4">
        <div className="flex flex-col items-center justify-center gap-12 md:flex-row">
          <TextInput
            fieldName="mail"
            fieldLabel={t("mail")}
            type="mail"
            className="h-10 w-full md:w-80"
          />
          <SelectField
            fieldLabel={t("role")}
            data={ROLES}
            fieldName="role"
            className="border-border! h-10! w-full truncate border! md:w-80"
          />
          <TextInput
            fieldName="name"
            fieldLabel={t("name")}
            type="text"
            className="h-10 w-full md:w-80"
          />
          <SwitchInput fieldName="status" fieldLabel={t("status")} />
        </div>
        <Separator className="my-1" />

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
        <Separator className="my-1" />
        <div className="grid w-full grid-cols-2 justify-between gap-1 md:h-1/5 md:grid-cols-6 md:gap-4">
          {TABS_KEY_ROUTE.filter((tab) =>
            accessList?.includes(tab.split("_")[0]),
          ).map((tab) => (
            <SwitchInput
              key={tab}
              fieldName={tab}
              fieldLabel={tab}
              checked={accessTabs?.includes(tab) ?? false}
              onCheckedChange={(checked) => handleTabToggle(tab, checked)}
            />
          ))}
        </div>
      </div>
    </FormWrapper>
  );
}
