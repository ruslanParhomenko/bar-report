import { z } from "zod";
export const vacationPaySchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  countDays: z.string(),
});

export type VacationPaySchemaType = z.infer<typeof vacationPaySchema>;

export const defaultVacationPay = {
  startDate: "",
  endDate: "",
  countDays: "",
};

export const employeesSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  mail: z.string().optional(),
  tel: z.string().optional(),
  role: z.string().min(1, { message: "Role is required" }),
  rate: z.string().min(1, { message: "Rate is required" }),
  employmentDate: z.coerce.date().optional(),
  status: z.enum(["active", "fired"]),
  employeesWorkForm: z.boolean().optional(),
  employeesKey: z.boolean().optional(),
  vacationPay: z.array(vacationPaySchema).optional(),
});

export type EmployeesSchemaTypeData = z.input<typeof employeesSchema>;
export type EmployeesSchemaType = z.infer<typeof employeesSchema>;

export const defaultEmployeeSchemaValues: Partial<EmployeesSchemaTypeData> = {
  name: "",
  mail: "",
  tel: "",
  role: "",
  rate: "",
  employmentDate: undefined,
  status: "active",
  vacationPay: [defaultVacationPay],
};
