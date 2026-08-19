"use client";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUser } from "../actions/create-user";
import { GetUserData } from "../actions/get-users";
import { updateUser } from "../actions/update-user";
import { defaultUser, UserForm, usersSchema } from "../model/schema";

type FormData = UserForm;

export function useUsersForm(data?: GetUserData | null) {
  const router = useRouter();
  const { setIsEdit, registerReset } = useEdit();

  const id = data?.id;

  const defaultData = {
    name: data?.name || "",
    mail: data?.mail || "",
    role: data?.role || "",
    status: data?.status || false,
    accessList: data?.accessList || [],
    accessTabs: data?.accessTabs || [],
  };

  const form = useForm<FormData>({
    resolver: zodResolver(usersSchema),
    defaultValues: defaultData || defaultUser,
  });

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

  const reset = () => {
    form.reset({});
    toast.success("Форма сброшена");
  };

  useEffect(() => {
    registerReset(reset);
  }, []);
  return {
    form,
    onSubmit,
  };
}
