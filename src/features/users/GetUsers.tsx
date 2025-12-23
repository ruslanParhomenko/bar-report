"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2Icon } from "lucide-react";
import { deleteUser } from "@/app/actions/users/userAction";
import { useAbility } from "@/providers/AbilityProvider";
import { useRouter } from "next/navigation";

export function GetUsersCard() {
  const router = useRouter();
  const { query: users } = useAbility();

  const handleDeleteUser = (id: string) => deleteUser(id);

  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow className="text-gr">
          <TableHead className="w-6" />
          <TableHead className="w-30" />
          <TableHead className="w-10" />
          <TableHead className="text-center w-15" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {users?.map((user, idx) => (
          <TableRow key={user.id} className="hover:bg-muted/40">
            <TableCell>{idx + 1}</TableCell>
            <TableCell className="truncate">{user.mail}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className="gap-6 flex justify-center">
              <button
                className="cursor-pointer hover:bg-bl"
                type="button"
                onClick={() => router.push(`/users/${user.id}`)}
              >
                <Pencil className="w-4 h-4 text-bl" />
              </button>
              <button
                className="cursor-pointer hover:bg-rd"
                type="button"
                onClick={() => handleDeleteUser(user.id as string)}
              >
                <Trash2Icon className="w-4 h-4 text-rd" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
