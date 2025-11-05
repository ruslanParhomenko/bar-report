"use client";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAbility } from "@/providers/AbilityProvider";
import { defaultUser, usersSchema, UsersSchemaTypeData } from "./schema";
import CardFormUsers from "./CardFormUsers";
import { UsersTable } from "./CardTableUsers";
// import { createUser, updateUser } from "@/app/actions/users/userAction";
// import { invalidateUsers } from "@/app/actions/users/getUsers";

type FormData = UsersSchemaTypeData;

export default function AddUsers() {
  const { isAdmin } = useAbility();

  const form = useForm<FormData>({
    resolver: yupResolver(usersSchema),
    defaultValues: defaultUser,
  });
  const { reset: resetForm } = form;

  const { query: users } = useAbility();

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    // try {
    //   if (data.id) {
    //     await updateUser(data.id, {
    //       mail: data.mail,
    //       role: data.role,
    //     });
    //     invalidateUsers();
    //     toast.success("User is updated !");
    //   } else {
    //     await createUser({
    //       mail: data.mail,
    //       role: data.role,
    //     });
    //     invalidateUsers();
    //     toast.success("User is added !");
    //   }
    //   resetForm();
    // } catch (e) {
    //   toast.error("Error adding user");
    // }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-1 md:grid-cols-[30%_68%] w-full pt-4 md:gap-4"
      >
        <CardFormUsers disabled={!isAdmin} />
        <UsersTable data={users as UsersSchemaTypeData[]} />
      </form>
    </Form>
  );
}
