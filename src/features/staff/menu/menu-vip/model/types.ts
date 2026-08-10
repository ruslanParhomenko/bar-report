import { MenuItem } from "@/app/actions/data-constants/data-menu-action";

export interface MenuSection {
  id: string;
  title: string;
  items?: MenuItem[];
  subgroups?: { label: string; items: MenuItem[] }[];
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
