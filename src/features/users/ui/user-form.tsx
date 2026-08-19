"use client";

import SelectField from "@/components/input-controlled/select-field";
import SwitchInput from "@/components/input-form/switch-input";
import TextInput from "@/components/input-form/text-input";
import { Separator } from "@/components/ui/separator";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { ROUTES } from "@/constants/routes";
import { TABS_KEY_ROUTE } from "@/constants/tabs";
import { useTranslations } from "next-intl";
import { useWatch } from "react-hook-form";
import { GetUserData } from "../actions/get-users";
import { useUsersForm } from "../hooks/use-users-form";
import { ROLES } from "../model/constants";

export function UserFormPage({ user }: { user?: GetUserData | null }) {
  const t = useTranslations("Home");

  const { form, onSubmit } = useUsersForm(user);

  const accessList = useWatch({ control: form.control, name: "accessList" });
  const accessTabs = useWatch({ control: form.control, name: "accessTabs" });

  const handleAccessChange = (
    field: "accessList" | "accessTabs",
    value: string,
    checked: boolean,
  ) => {
    const current = form.getValues(field) || [];
    const updated = checked
      ? [...current, value]
      : current.filter((item) => item !== value);
    form.setValue(field, updated, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <div className="mt-6 flex flex-col gap-6 px-4">
        <div className="flex flex-col items-center justify-around gap-12 md:flex-row">
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
              onCheckedChange={(checked) =>
                handleAccessChange("accessList", route, checked)
              }
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
              onCheckedChange={(checked) =>
                handleAccessChange("accessTabs", tab, checked)
              }
            />
          ))}
        </div>
      </div>
    </FormWrapper>
  );
}
