"use client";
import { updateUser, UserData } from "@/app/actions/users/user-action";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { CheckCircle, FolderPlus, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UsersActions from "./users-action";

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
              <FolderPlus className="text-bl h-5 w-5" />
            </button>
          </TableCell>
        </TableRow>
        {localUsers?.map((user, idx) => (
          <TableRow key={user.id}>
            <TableCell className="max-w-4">{idx + 1}</TableCell>
            <TableCell className="max-w-8 truncate md:w-80">
              {user.mail}
            </TableCell>
            <TableCell className="max-w-4">
              {isMobile ? user.role[0] : user.role}
            </TableCell>
            <TableCell className="max-w-14 font-medium md:w-20">
              {user.name}
            </TableCell>
            <TableCell className="max-w-16">
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
            <TableCell className="max-w-8 md:px-4">
              <UsersActions id={user.id as string} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
