import { z } from "zod";

export const usersSchema = z.object({
  mail: z.string().email({ message: "required" }),
  role: z.string().min(1, { message: "required" }),
});

export type UsersSchemaTypeData = z.infer<typeof usersSchema> & {
  id?: string;
};

export const defaultUser: UsersSchemaTypeData = {
  mail: "",
  role: "",
};
