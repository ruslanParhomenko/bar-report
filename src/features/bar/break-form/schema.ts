import { TIME_LABELS } from "./constant";

import { z } from "zod";

const hourValueSchema = z.enum(["X", "", "00", "20", "40"]);

const hoursSchema = z.array(hourValueSchema).length(TIME_LABELS.length);

export const rowsSchema = z.object({
  id: z.enum(["8-20", "9-21", "12-00", "18-06", "20-08"]),
  name: z.string(),
  hours: hoursSchema,
});

type Row = z.infer<typeof rowsSchema>;

export const breakSchema = z.object({
  rows: z.array(rowsSchema),
});
export type BreakForm = z.infer<typeof breakSchema>;

export const breakListDefault = (data: Row[]): BreakForm => ({
  rows: data as BreakForm["rows"],
});
