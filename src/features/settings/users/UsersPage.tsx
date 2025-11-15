"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { defaultUser, usersSchema, UsersSchemaTypeData } from "./schema";

import { createUser, updateUser } from "@/app/actions/users/userAction";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import AddUsersCard from "./AddUsersCard";
import { GetUsersCard } from "./GetUsersCard";

type FormData = UsersSchemaTypeData;

export function UsersPage() {
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
    } catch (e) {
      toast.error("Error adding user");
    }
  };

  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-[30%_68%] w-full pt-4 md:gap-4"
    >
      <AddUsersCard />
      <GetUsersCard />
    </FormWrapper>
  );
}
