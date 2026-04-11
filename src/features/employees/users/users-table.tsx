"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { UserData } from "@/app/actions/users/user-action";
import UsersActions from "./users-action";
import { CheckCircle, Folder, FolderPlus, UserX } from "lucide-react";
import { updateUser } from "@/app/actions/users/user-action";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";

export default function UsersTable({ users }: { users: UserData[] }) {
  const router = useRouter();

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
    <Table className="md:table-fixed">
      <TableBody>
        <TableRow>
          <TableCell colSpan={6}>
            <button onClick={() => router.push("/create-users")}>
              <FolderPlus className="w-5 h-5 text-bl" />
            </button>
          </TableCell>
        </TableRow>
        {localUsers?.map((user, idx) => (
          <TableRow key={user.id}>
            <TableCell className="max-w-4">{idx + 1}</TableCell>
            <TableCell className="truncate max-w-8 md:w-80">
              {user.mail}
            </TableCell>
            <TableCell className="max-w-4">
              {isMobile ? user.role[0] : user.role}
            </TableCell>
            <TableCell className="font-medium md:w-20 max-w-14">
              {user.name}
            </TableCell>
            <TableCell className="max-w-16">
              <div className="flex items-center gap-6">
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
              </div>
            </TableCell>
            <TableCell className="max-w-8 md:px-4">
              <UsersActions id={user.id as string} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
