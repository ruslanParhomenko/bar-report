import { BREAK_LIST_DEFAULT, TIME_LABELS } from "./constant";

import { z } from "zod";

const hourValueSchema = z.enum(["X", "", "00", "20", "40"]);

const hoursSchema = z.array(hourValueSchema).length(TIME_LABELS.length);

export const rowsSchema = z.object({
  id: z.enum(["8-20", "9-21", "14-02", "18-06", "20-08"]),
  name: z.string(),
  hours: hoursSchema,
});

export const breakSchema = z.object({
  rows: z.array(rowsSchema),
});
export type BreakFormData = z.infer<typeof breakSchema>;

export const defaultValuesBreak: BreakFormData = {
  rows: BREAK_LIST_DEFAULT as BreakFormData["rows"],
};
