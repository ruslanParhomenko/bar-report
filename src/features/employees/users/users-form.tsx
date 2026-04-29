"use client";
import { createUser, updateUser } from "@/app/actions/users/user-action";
import SelectField from "@/components/input-controlled/select-field";
import SwitchInput from "@/components/input-controlled/switch-input";
import TextInput from "@/components/input-controlled/text-input";
import { Form } from "@/components/ui/form";
import { useAbility } from "@/providers/ability-provider";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { defaultUser, usersSchema, UsersSchemaTypeData } from "./schema";

const ROLES = ["ADMIN", "BAR", "CUCINA", "USER", "MNGR", "CASH", "FIN", "SCR"];

type FormData = UsersSchemaTypeData;

export default function UsersForm({ id }: { id?: string }) {
  const pathname = usePathname();
  const formId = pathname.split("/")[1] || "";

  const { setIsEdit, registerReset } = useEdit();

  const router = useRouter();
  const t = useTranslations("Home");

  const { users } = useAbility();
  const user = id ? users?.find((u) => u.id === id) : undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(usersSchema),
    defaultValues: user || defaultUser,
  });

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (id) {
        await updateUser(id, {
          mail: data.mail,
          role: data.role,
          name: data.name,
          status: data.status,
        });

        toast.success("User is updated !");
      } else {
        await createUser({
          mail: data.mail,
          role: data.role,
          name: data.name,
          status: data.status,
        });

        toast.success("User is added !");
      }
    } catch (e) {
      toast.error("Error adding user");
    }

    setIsEdit(false);
    router.replace(returnUrl);
  };
  useEffect(() => {
    setIsEdit(true);
    registerReset(form.reset);
    return () => {
      setIsEdit(false);
    };
  }, []);

  const returnUrl = "/employees#tab=users";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} id={formId}>
        <div className="mt-6 flex flex-col gap-4">
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
        </div>
      </form>
    </Form>
  );
}
