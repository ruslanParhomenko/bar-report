"use client";
import { useState, useEffect } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useApi } from "@/hooks/useApi";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "@/components/inputs/TextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

export default function AddUsersForm() {
  const [users, setUsers] = useState([]);

  const { createMutation: addUser } = useApi<any>({
    endpoint: "users",
    queryKey: "users",
    fetchInit: false,
  });
  const { query } = useApi<any>({
    endpoint: "users",
    queryKey: "users",
    fetchInit: true,
  });
  const { data } = query;

  useEffect(() => {
    if (data) {
      setUsers(data as any);
    }
  }, [data]);

  const form = useForm({
    defaultValues: {
      mail: "",
      role: "",
    },
  });
  const { reset: resetForm } = form;

  const handleSubmit: SubmitHandler<any> = async (data) => {
    try {
      addUser.mutateAsync({
        mail: data.mail,
        role: data.role,
      }),
        toast.success("Пользователь добавлен !");
      resetForm();
    } catch (e) {
      toast.error("Ошибка при добавлении пользователя");
    }
  };

  const handleDeleteUser = async (id: any) => {
    await deleteDoc(doc(db, "users", id));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col md:min-h-[95vh]"
      >
        <TextInput fieldName="mail" fieldLabel="Email" />
        <TextInput fieldName="role" fieldLabel="Role" />
        <Button type="submit">Add User</Button>
      </form>
    </Form>
  );
}
