import * as yup from "yup";
//users
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

//employees
export const vacationPaySchema = yup.object({
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
  countDays: yup.string().required("Number of days is required"),
});

export const employeesSchema = yup.object({
  name: yup.string().required("Name is required"),
  role: yup.string().required("Role is required"),
  rate: yup.string().required("Rate is required"),
  employmentDate: yup.string().required("Employment date is required"),
  vacationPay: yup.array().of(vacationPaySchema).default([]),
});

export type EmployeesSchemaTypeData = yup.InferType<typeof employeesSchema> & {
  id?: string;
};
export const defaultVacationPay = {
  startDate: "",
  endDate: "",
  countDays: "",
};
export const defaultEmployee = {
  name: "",
  role: "",
  rate: "",
  employmentDate: "",
  vacationPay: [{
    startDate: "",
    endDate: "",
    countDays: "",
  }],
};
