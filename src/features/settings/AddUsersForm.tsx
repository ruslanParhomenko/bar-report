"use client";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { defaultUser, usersSchema, UsersSchemaTypeData } from "./schema";
import TextInput from "@/components/inputs/TextInput";
import SelectField from "@/components/inputs/SelectField";
import { ROLES } from "./constants";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { USERS_FIREBOX_ENDPOINT } from "@/constants/endpoint-tag";
import { useApi } from "@/hooks/useApi";
import { Delete, Plus } from "lucide-react";
import { useAbility } from "@/providers/AbilityProvider";

export default function AddUsersForm() {
  const { isAdmin } = useAbility();
  const form = useForm<UsersSchemaTypeData>({
    resolver: yupResolver(usersSchema),
    defaultValues: defaultUser,
  });
  const { reset: resetForm } = form;

  const { createMutation: addUser } = useApi<UsersSchemaTypeData>({
    endpoint: USERS_FIREBOX_ENDPOINT,
    queryKey: USERS_FIREBOX_ENDPOINT,
    fetchInit: false,
  });

  const handleSubmit: SubmitHandler<UsersSchemaTypeData> = async (data) => {
    try {
      addUser.mutateAsync({
        mail: data.mail,
        role: data.role,
      }),
        toast.success("User is added !");
      resetForm();
    } catch (e) {
      toast.error("Error adding user");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex justify-between  w-full  py-4"
      >
        <div className="flex gap-1 md:gap-20">
          <TextInput
            fieldName="mail"
            type="mail"
            className="md:min-w-xs truncate"
            placeholder="Enter mail"
          />
          <SelectField
            data={ROLES}
            fieldName="role"
            className="truncate md:min-w-xs"
            placeHolder="Select role"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-4">
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => resetForm()}
          >
            <Delete />
          </Button>
          <Button type="submit" disabled={!isAdmin}>
            <Plus />
          </Button>
        </div>
      </form>
    </Form>
  );
}
