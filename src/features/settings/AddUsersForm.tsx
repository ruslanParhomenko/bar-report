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
import { ROLES } from "./constants";
import SelectField from "@/components/inputs/SelectField";
import { Label } from "@/components/ui/label";

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
    <div className="md:max-w-3xl w-full md:mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col md:items-center md:justify-between  md:flex-row"
        >
          <TextInput fieldName="mail" type="mail" className="w-full" />
          <SelectField
            data={ROLES}
            fieldName="role"
            className="md:w-3xs w-full"
            placeHolder="Select role"
          />
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => resetForm()}
          >
            X
          </Button>
          <Button type="submit">Add User</Button>
        </form>
        <div className="my-6">
          {users &&
            users?.map((emp: any, idx: number) => (
              <div
                key={`${emp.id}-${idx}`}
                className="flex justify-between py-2 w-full"
              >
                <Label className="min-w-5/9">{emp.mail}</Label>
                <Label className="text-muted-foreground min-w-2/9">
                  {emp.role}
                </Label>
                <Button
                  variant={"destructive"}
                  className="min-w-1/9"
                  onClick={() => handleDeleteUser(emp.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
        </div>
      </Form>
    </div>
  );
}
