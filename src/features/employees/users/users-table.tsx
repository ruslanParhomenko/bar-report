"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { UserData } from "@/app/actions/users/user-action";
import UsersActions from "./users-action";
import { CheckCircle, UserX } from "lucide-react";
import { updateUser } from "@/app/actions/users/user-action";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function UsersTable({ users }: { users: UserData[] }) {
  const [localUsers, setLocalUsers] = useState(users);

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
    );

    try {
      const user = localUsers.find((u) => u.id === id);
      if (!user) return;
      await updateUser(id, { ...user, status: newStatus });
    } catch (err) {
      console.error("Ошибка при обновлении статуса:", err);

      setLocalUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: !newStatus } : u)),
      );
    }
  };

  return (
    <Table className="table-fixed">
      <TableBody>
        {localUsers?.map((user, idx) => (
          <TableRow key={user.id}>
            <TableCell className="w-8">{idx + 1}</TableCell>
            <TableCell className="truncate w-50 md:w-80">{user.mail}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="flex items-center gap-2">
              {user.status ? (
                <CheckCircle className="w-4 h-4 text-bl" />
              ) : (
                <UserX className="w-4 h-4 text-rd" />
              )}

              <Switch
                checked={user.status}
                onCheckedChange={(checked) =>
                  user.id && handleStatusChange(user.id, checked)
                }
              />
            </TableCell>
            <TableCell className="w-20 px-2">
              <UsersActions id={user.id as string} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
