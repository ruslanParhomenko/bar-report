import { z } from "zod";
import { TIME_LABELS } from "./constant";

const hourValueSchema = z.enum(["-", "", "00", "20", "40"]);

const hoursSchema = z.array(hourValueSchema).length(TIME_LABELS.length);

export const rowsSchema = z.object({
  id: z.enum(["8-20", "9-21", "12-00", "18-06", "20-08"]),
  name: z.string(),
  hours: hoursSchema,
  isAdded: z.boolean().optional(),
});

type Row = z.infer<typeof rowsSchema>;

export const breakSchema = z.object({
  rows: z.array(rowsSchema),
});
export type BreakForm = z.infer<typeof breakSchema>;

export const breakListDefault = (data: Row[]): BreakForm => ({
  rows: data as BreakForm["rows"],
});
