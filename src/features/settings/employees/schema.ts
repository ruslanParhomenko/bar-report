import * as yup from "yup";

//employees
export const vacationPaySchema = yup.object({
  startDate: yup.string(),
  endDate: yup.string(),
  countDays: yup.string(),
});
export type VacationPaySchemaType = yup.InferType<typeof vacationPaySchema>;
export const employeesSchema = yup.object({
  name: yup.string().required("Name is required"),
  role: yup.string().required("Role is required"),
  rate: yup.string().required("Rate is required"),
  employmentDate: yup.string().default(""),
  vacationPay: yup.array().of(vacationPaySchema).default([]),
});

export type EmployeesSchemaTypeData = yup.InferType<typeof employeesSchema>;
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
  vacationPay: [
    {
      startDate: "",
      endDate: "",
      countDays: "",
    },
  ],
};

// const
export const EMPLOYEES_ROLE = [
  "barmen",
  "waiters",
  "cook",
  "mngr",
  "dish",
  "buyer",
];
