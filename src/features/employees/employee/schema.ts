import { z } from "zod";
export const vacationSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  countDays: z.string(),
});

export const defaultVacationForm = {
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
  employmentDate: z.string(),
  status: z.enum(["active", "fired"]),
  employeesWorkForm: z.boolean().optional(),
  employeesKey: z.boolean().optional(),
  vacationPay: z.array(vacationSchema).optional(),
});

export type EmployeeForm = z.infer<typeof employeesSchema>;

export const defaultEmployeeForm: Partial<EmployeeForm> = {
  name: "",
  mail: "",
  tel: "",
  role: "",
  rate: "",
  employmentDate: "",
  status: "active",
  employeesWorkForm: false,
  employeesKey: false,
  vacationPay: [defaultVacationForm],
};
