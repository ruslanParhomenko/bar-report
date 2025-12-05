import * as yup from "yup";
export const remarkSchema = yup.object().shape({
  id: yup.number().optional(),
  name: yup.string().default(""),
  dayHours: yup.string().default(""),
  nightHours: yup.string().default(""),
  penalty: yup.string().default(""),
  reason: yup.string().default(""),
  bonus: yup.string().default(""),
  reportId: yup.number().optional(),
});

export type RemarkFormData = yup.InferType<typeof remarkSchema>;

export const defaultRemarkValue = remarkSchema.getDefault();

export const remarksSchema = yup.object().shape({
  remarks: yup
    .array()
    .of(remarkSchema)
    .default([
      {
        name: "",
        dayHours: "",
        nightHours: "",
        penalty: "",
        reason: "",
        bonus: "",
      },
    ]),
  date: yup.date().default(new Date()),
});

export type RemarksFormData = yup.InferType<typeof remarksSchema>;

export const defaultRemarksValue = remarksSchema.getDefault();
