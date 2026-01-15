import { ArrayRow } from "@/components/table/row-render";

export const rowsAdvance = [
  {
    key: "advanceModaByDay",
    label: "advance-moda",
    colorText: " text-bl",
    type: "input",
  },
  {
    key: "advanceNBMByDay",
    label: "advance-nbm",
    colorText: " text-bl",
    type: "input",
  },
  {
    key: "advanceZBN",
    label: "advance-zbn",
    colorText: " text-bl",
    type: "input",
  },
] satisfies ArrayRow[];
export const rowsPurchaseModa = [
  {
    key: "purchaseModaByDay",
    label: "purchase-moda",
    colorText: " text-black",
    type: "input",
  },
  {
    key: "ttnModaByDay",
    label: "ttn-moda",
    colorText: " text-black",
    type: "input",
  },
  {
    key: "nameTtnModaByDay",
    label: "name-ttn-moda",
    colorText: " text-muted-foreground text-xs",
    type: "text",
  },
  {
    key: "purchaseBarByDay",
    label: "purchase-bar",
    colorText: " text-black",
    type: "input",
  },
  {
    key: "ttnBarByDay",
    label: "ttn-bar",
    colorText: " text-black",
    type: "input",
  },
  {
    key: "nameTtnBarByDay",
    label: "name-ttn-bar",
    colorText: " text-muted-foreground text-xs",
    type: "text",
  },
] satisfies ArrayRow[];

export const rowsPurchaseNMB = [
  {
    key: "fuelNBMByDay",
    label: "fuel-nbm",
    colorText: " text-gn",
    type: "input",
  },
  {
    key: "purchaseNBMByDay",
    label: "purchase-nbm",
    colorText: " text-gn",
    type: "input",
  },
  {
    key: "ttnNBMByDay",
    label: "ttn-nbm",
    colorText: " text-gn",
    type: "input",
  },
] satisfies ArrayRow[];
