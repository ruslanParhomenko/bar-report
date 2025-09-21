import * as yup from "yup";
import { BREAK_LIST_DEFAULT } from "./constant";

const hourValueSchema = yup.string().oneOf(["X", "", "00", "20", "40"]);

const hoursSchema = yup.object({
  "9": hourValueSchema,
  "10": hourValueSchema,
  "11": hourValueSchema,
  "12": hourValueSchema,
  "13": hourValueSchema,
  "14": hourValueSchema,
  "15": hourValueSchema,
  "16": hourValueSchema,
  "17": hourValueSchema,
  "18": hourValueSchema,
  "19": hourValueSchema,
  "20": hourValueSchema,
  "21": hourValueSchema,
  "22": hourValueSchema,
  "23": hourValueSchema,
  "24": hourValueSchema,
  "01": hourValueSchema,
  "02": hourValueSchema,
  "03": hourValueSchema,
  "04": hourValueSchema,
  "05": hourValueSchema,
  "06": hourValueSchema,
  "07": hourValueSchema,
});

export const breakSchema = yup.object({
  id: yup
    .string()
    .oneOf(["8-20", "9-21", "14-02", "18-06", "20-08"])
    .required(),
  name: yup.string(),
  hours: hoursSchema,
});
export const remarksSchema = yup.object().shape({
  name: yup.string(),
  dayHours: yup.string(),
  nightHours: yup.string(),
  penality: yup.string(),
  reason: yup.string(),
});

export const defaultRemarks = {
  name: "",
  dayHours: "",
  nightHours: "",
  penality: "",
  reason: "",
};

export const dataSchema = yup.object({
  date: yup.date().required(),
  rows: yup.array(breakSchema).required(),
  remarks: yup.array(remarksSchema).default([]),
});
export type BreakRemarksData = yup.InferType<typeof dataSchema>;
export const defaultValuesBrakeList = {
  date: new Date(),
  rows: BREAK_LIST_DEFAULT.map((item) => ({
    id: item.id,
    name: item.name,
    hours: Object.assign({}, ...item.hours),
  })),
  remarks: [defaultRemarks],
};
