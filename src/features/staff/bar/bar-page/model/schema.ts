import z from "zod";
import { remarksDefault, remarksSchema } from "../../penalty/model/schema";
import { tipsAddSchema } from "../../tips-add/model/schema";
import { reportBarDefault, reportBarSchema } from "../../report/model/schema";
import { breakListDefault, breakSchema } from "../../break/model/schema";

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
