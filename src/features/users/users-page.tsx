"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2Icon } from "lucide-react";
import { deleteUser, UserData } from "@/app/actions/users/userAction";
import { useRouter } from "next/navigation";

export default function UsersPage({ users }: { users: UserData[] }) {
  const router = useRouter();

  const handleDeleteUser = (id: string) => deleteUser(id);

  return (
    <div className="py-6 px-12">
      <Table>
        <TableBody>
          {users?.map((user, idx) => (
            <TableRow key={user.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell className="truncate">{user.mail}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="w-30 px-4">
                <div className="flex justify-between">
                  <button
                    className="cursor-pointer"
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
