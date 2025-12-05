import * as yup from "yup";

// Vacation pay schema
export const vacationPaySchema = yup.object({
  startDate: yup.string().default(""),
  endDate: yup.string().default(""),
  countDays: yup.string().default(""),
});
export type VacationPaySchemaType = yup.InferType<typeof vacationPaySchema>;

// Employee schema
export const employeesSchema = yup.object({
  name: yup.string().required("Name is required").default(""),
  mail: yup.string().email().default(""),
  tel: yup.string().default(""),
  role: yup.string().required("Role is required").default(""),
  rate: yup.string().required("Rate is required").default(""),
  employmentDate: yup.string().default(""),
  dismissalDate: yup.string().default(""),
  status: yup.string().oneOf(["active", "fired"]).default("active"),
  reason: yup.string().default(""),
  vacationPay: yup.array().of(vacationPaySchema).default([]),
});

export type EmployeesSchemaTypeData = yup.InferType<typeof employeesSchema>;
export const defaultVacationPay = {
  startDate: "",
  endDate: "",
  countDays: "",
};
export const defaultEmployeeSchemaValues: EmployeesSchemaTypeData = {
  name: "",
  mail: "",
  tel: "",
  role: "",
  rate: "",
  employmentDate: "",
  dismissalDate: "",
  status: "active",
  reason: "",
  vacationPay: [defaultVacationPay],
};

// const
export const EMPLOYEES_ROLE = [
  { label: "barmen", value: "barmen" },
  { label: "waiters", value: "waiters" },
  { label: "cook", value: "cook" },
  { label: "mngr", value: "mngr" },
  { label: "dish", value: "dish" },
  { label: "buyer", value: "buyer" },
];
