import z from "zod";
import { breakSchema, defaultValuesBreak } from "./break-form/schema";
import { defaultRemarksValue, remarksSchema } from "./penalty/schema";
import { defaultValuesReportBar, reportBarSchema } from "./report/schema";

export const barSchema = z.object({
  date: z.date(),
  report: reportBarSchema,
  penalty: remarksSchema,
  breakForm: breakSchema,
});

export type BarFormValues = z.infer<typeof barSchema>;

export const defaultValuesBarForm = {
  date: new Date(),
  report: defaultValuesReportBar,
  penalty: defaultRemarksValue,
  breakForm: defaultValuesBreak,
};
