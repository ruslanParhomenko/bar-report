import { z } from "zod";

export const usersSchema = z.object({
  mail: z.string().min(1, { message: "required" }),
  role: z.string().min(1, { message: "required" }),
  name: z.string(),
  status: z.boolean(),
  accessList: z.array(z.string()),
});

export type UserForm = z.infer<typeof usersSchema>;

export const defaultUser: UserForm = {
  mail: "",
  role: "",
  name: "",
  status: false,
  accessList: [],
};
