import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { createMenuWeek } from "../actions/create-menu-week";
import {
  menuWeekDefaultValues,
  MenuWeekForm,
  menuWeekSchema,
} from "../model/schema";

export function useMenuWeekForm(data: MenuWeekForm | null) {
  const { setIsEdit } = useEdit();

  const form = useForm<MenuWeekForm>({
    resolver: zodResolver(menuWeekSchema),
    defaultValues: data ?? menuWeekDefaultValues,
  });

  const onSubmit: SubmitHandler<MenuWeekForm> = async (formData) => {
    await createMenuWeek(formData);

    setIsEdit(false);
  };
  return {
    form,
    onSubmit,
  };
}
