import z from "zod";
import { breakListDefault, breakSchema } from "./break-form/schema";
import { remarksDefault, remarksSchema } from "./penalty/schema";
import { reportBarDefault, reportBarSchema } from "./report/schema";
import { tipsAddSchema } from "./tips-add/schema";

export const barPageSchema = z.object({
  date: z.string(),
  report: reportBarSchema,
  penalty: remarksSchema,
  breakForm: breakSchema,
  tipsAdd: z.array(tipsAddSchema),
});

export type BarForm = z.infer<typeof barPageSchema>;

export const barPageDefault = {
  date: new Date().toISOString(),
  report: reportBarDefault,
  penalty: remarksDefault,
  breakForm: breakListDefault([]),
  tipsAdd: [],
};
