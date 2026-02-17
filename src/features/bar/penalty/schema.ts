import { z } from "zod";

export const remarkSchema = z.object({
  name: z.string(),
  dayHours: z.string(),
  nightHours: z.string(),
  penalty: z.string(),
  reason: z.string(),
  bonus: z.string(),
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
