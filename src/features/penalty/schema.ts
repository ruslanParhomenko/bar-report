import { z } from "zod";

export const remarkSchema = z.object({
  id: z.number().optional(),
  name: z.string().default(""),
  dayHours: z.string().default(""),
  nightHours: z.string().default(""),
  penalty: z.string().default(""),
  reason: z.string().default(""),
  bonus: z.string().default(""),
  reportId: z.number().optional(),
});

export type RemarkFormData = z.infer<typeof remarkSchema>;

export const defaultRemarkValue: RemarkFormData = remarkSchema.parse({});

export const remarksSchema = z.object({
  remarks: z.array(remarkSchema).default([
    {
      name: "",
      dayHours: "",
      nightHours: "",
      penalty: "",
      reason: "",
      bonus: "",
    },
  ]),
  date: z.date().default(() => new Date()),
});

export type RemarksFormData = z.infer<typeof remarksSchema>;

export const defaultRemarksValue: RemarksFormData = remarksSchema.parse({});
