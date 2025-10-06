import * as yup from "yup";
export const usersSchema = yup.object({
  mail: yup.string().email().required("required"),
  role: yup.string().required("required"),
});

export type UsersSchemaTypeData = yup.InferType<typeof usersSchema> & {
  id?: string;
};
export const defaultUser = {
  mail: "",
  role: "",
};
