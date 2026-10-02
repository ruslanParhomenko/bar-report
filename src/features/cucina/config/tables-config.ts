import { DataProducts } from "@/features/setting/model/type";
import { ArrayPath } from "react-hook-form";
import {
  productPreparedDefault,
  ProductPreparedType,
  ReportKitchenForm,
  ReportShiftType,
  ReportWriteOffType,
  shiftDefault,
  writeOffDefault,
} from "../model/schema";
import { REASON, SELECT_TIME } from "./constants";

export type TablesConfigItem = {
  name: ArrayPath<ReportKitchenForm>;
  placeHolder: {
    fieldName: string;
    weight?: string;
    shift?: string;
    over?: string;
    time?: string;
    reason?: string;
  };
  dataShifts?: string[];
  dataReasons?: string[];
  dataFieldArray: Array<string>;
  defaultValue: ReportShiftType | ProductPreparedType | ReportWriteOffType;
};

export function getTablesConfig(
  dataProducts: DataProducts | null,
  employees: string[],
): TablesConfigItem[] {
  return [
    {
      name: "shifts",
      placeHolder: { fieldName: "employees", shift: "time", over: "over" },
      dataShifts: SELECT_TIME,
      dataFieldArray: employees,
      defaultValue: shiftDefault,
    },

    {
      name: "preparedSalads",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: dataProducts?.salad || [],
      defaultValue: productPreparedDefault,
    },
    {
      name: "preparedFirst",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: dataProducts?.soup || [],
      defaultValue: productPreparedDefault,
    },

    {
      name: "preparedGarnish",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: dataProducts?.garnish || [],
      defaultValue: productPreparedDefault,
    },
    {
      name: "preparedSeconds",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: dataProducts?.meat || [],
      defaultValue: productPreparedDefault,
    },
    {
      name: "preparedDesserts",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: dataProducts?.dessert || [],
      defaultValue: productPreparedDefault,
    },
    {
      name: "cutting",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: [
        ...(dataProducts?.semifinished || []),
        ...(dataProducts?.meat_fish || []),
      ],
      defaultValue: productPreparedDefault,
    },
    {
      name: "staff",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: [
        ...(dataProducts?.staff_first || []),
        ...(dataProducts?.staff_main || []),
        ...(dataProducts?.staff_garnish || []),
        ...(dataProducts?.staff_snacks || []),
      ],

      defaultValue: productPreparedDefault,
    },
    {
      name: "staffFurchet",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        time: "time",
      },
      dataFieldArray: [
        ...(dataProducts?.garnish || []),
        ...(dataProducts?.soup || []),
        ...(dataProducts?.meat || []),
      ],
      defaultValue: productPreparedDefault,
    },
    {
      name: "writeOff",
      placeHolder: {
        fieldName: "product",
        weight: "weight",
        reason: "reason",
      },
      dataReasons: REASON,
      dataFieldArray: [
        ...(dataProducts?.ingredients || []),
        ...(dataProducts?.garnish || []),
        ...(dataProducts?.soup || []),
        ...(dataProducts?.meat || []),
      ],
      defaultValue: writeOffDefault,
    },
  ] satisfies TablesConfigItem[];
}
