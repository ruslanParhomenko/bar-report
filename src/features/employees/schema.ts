import { z } from "zod";
import { EMPLOYEES_ROLE } from "./constants";

export const vacationPaySchema = z.object({
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  countDays: z.string().default(""),
});

export type VacationPaySchemaType = z.infer<typeof vacationPaySchema>;

export const defaultVacationPay: VacationPaySchemaType =
  vacationPaySchema.parse({});

export const employeesSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).default(""),
  mail: z.string().default(""),
  tel: z.string().default(""),
  role: z.string().default(""),
  rate: z.string().min(1, { message: "Rate is required" }).default(""),
  employmentDate: z.string().default(""),
  dismissalDate: z.string().nullable().default(""),

  status: z.enum(["active", "fired"]).default("active"),
  reason: z.string().default(""),
  vacationPay: z.array(vacationPaySchema).default([defaultVacationPay]),
});

export type EmployeesSchemaTypeData = z.infer<typeof employeesSchema>;

export const defaultEmployeeSchemaValues: EmployeesSchemaTypeData =
  employeesSchema.parse({});
