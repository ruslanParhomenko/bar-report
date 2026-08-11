import { DataMenu } from "@/features/settings/setting/model/type";
import { ValueOf } from "next/dist/shared/lib/constants";

export interface MenuSection {
  id: string;
  title: string;
  items?: ValueOf<DataMenu>;
  subgroups?: { label: string; items: ValueOf<DataMenu> }[];
}

export interface MenuColumn {
  id: string;
  title?: string;
  type?: "cover" | "single";
  qrUrl?: string;
  sections?: MenuSection[];
}

export interface PageStructure {
  id: string;
  columns: MenuColumn[];
}

export type LocalTranslateFn = (key: string) => string;
