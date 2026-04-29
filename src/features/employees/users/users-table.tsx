"use client";
import { updateUser, UserData } from "@/app/actions/users/user-action";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { CheckCircle, UserX } from "lucide-react";
import { useState } from "react";
import UsersActions from "./users-action";

export default function UsersTable({ users }: { users: UserData[] }) {
  const [localUsers, setLocalUsers] = useState(users);

  const isMobile = useIsMobile();

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
    <Table className="mt-4 md:table-fixed">
      <TableBody>
        {localUsers?.map((user, idx) => (
          <TableRow key={user.id}>
            <TableCell className="w-8">{idx + 1}</TableCell>
            <TableCell className="w-80 truncate">{user.mail}</TableCell>
            <TableCell className="w-40">
              {isMobile ? user.role[0] : user.role}
            </TableCell>
            <TableCell className="w-30 font-medium">{user.name}</TableCell>
            <TableCell className="w-40">
              <div className="flex items-center gap-6">
                {user.status ? (
                  <CheckCircle className="text-bl h-4 w-4" />
                ) : (
                  <UserX className="text-rd h-4 w-4" />
                )}

                <Switch
                  checked={user.status}
                  onCheckedChange={(checked) =>
                    user.id && handleStatusChange(user.id, checked)
                  }
                />
              </div>
            </TableCell>
            <TableCell className="w-12 md:px-4">
              <UsersActions id={user.id as string} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
