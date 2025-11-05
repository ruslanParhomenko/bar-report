"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Minus, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { useFormContext } from "react-hook-form";
// import { deleteUser } from "@/app/actions/users/userAction";
import { UsersSchemaTypeData } from "./schema";

export function UsersTable({ data }: { data: UsersSchemaTypeData[] }) {
  const t = useTranslations("Home");
  const form = useFormContext<UsersSchemaTypeData>();

  // const handleDeleteUser = (id: string) => deleteUser(id);

  return (
    <Card className="shadow-md border rounded-2xl overflow-hidden py-6 px-2 md:px-6">
      <Table>
        <TableHeader>
          <TableRow className="text-gr">
            <TableHead>#</TableHead>
            <TableHead>{t("email")}</TableHead>
            <TableHead>{t("role")}</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((user, idx) => (
            <TableRow key={user.id} className="hover:bg-muted/40">
              <TableCell>{idx + 1}</TableCell>
              <TableCell className="truncate">{user.mail}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="gap-2 flex justify-center">
                <Button
                  className="cursor-pointer hover:bg-bl"
                  variant="secondary"
                  type="button"
                  size="sm"
                  onClick={() => form.reset(user)}
                >
                  <Pencil />
                </Button>
                <Button
                  className="cursor-pointer hover:bg-rd"
                  variant="secondary"
                  size={"sm"}
                  type="button"
                  // onClick={() => handleDeleteUser(user.id as string)}
                >
                  <Minus />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
