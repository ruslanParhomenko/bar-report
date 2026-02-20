import { z } from "zod";

export const remarkSchema = z.object({
  name: z.string().optional(),
  dayHours: z.string().optional(),
  nightHours: z.string().optional(),
  penalty: z.string().optional(),
  reason: z.string().optional(),
  bonus: z.string().optional(),
});

export type RemarkFormData = z.infer<typeof remarkSchema>;

export const defaultRemarkValue = {
  name: "",
  dayHours: "",
  nightHours: "",
  penalty: "",
  reason: "",
  bonus: "",
};

export const remarksSchema = z.object({
  remarks: z.array(remarkSchema),
});

export type RemarksFormData = z.infer<typeof remarksSchema>;

export const defaultRemarksValue = {
  remarks: [defaultRemarkValue],
};
