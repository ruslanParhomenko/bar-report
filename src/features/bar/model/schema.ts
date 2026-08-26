import { breakListDefault, breakSchema } from "@/features/break/model/schema";
import { remarksDefault, remarksSchema } from "@/features/penalty/model/schema";
import {
  reportBarDefault,
  reportBarSchema,
} from "@/features/report-bar/model/schema";
import { tipsAddSchema } from "@/features/tips-add/model/schema";
import z from "zod";

export const barPageSchema = z.object({
  date: z.string(),
  report: reportBarSchema,
  penalty: remarksSchema,
  breakForm: breakSchema.optional(),
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
