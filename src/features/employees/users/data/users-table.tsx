"use client";
import { deleteUser, updateUser } from "@/app/actions/users/user-action";
import DeleteButton from "@/components/buttons/delete-button";
import LinkEditButton from "@/components/buttons/link-edit-button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CREATE_USER_MAIN_ROUTE } from "@/constants/route-tag";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAbility } from "@/providers/ability-provider";
import { CheckCircle, UserX } from "lucide-react";
import { useState } from "react";

export default function UsersTable({ isAdmin }: { isAdmin: boolean }) {
  const { users } = useAbility();
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
    <Table className="mt-4 md:table-fixed [&>tbody>tr]:text-xs">
      <TableBody>
        {localUsers?.map((user, idx) => (
          <TableRow key={user.id}>
            <TableCell className="w-8">{idx + 1}</TableCell>
            <TableCell className="w-50 truncate">{user.mail}</TableCell>
            <TableCell className="w-20">
              {isMobile ? user.role[0] : user.role}
            </TableCell>
            <TableCell className="w-30 font-medium">{user.name}</TableCell>
            <TableCell className="w-40">
              <div className="flex items-center gap-6">
                {user.status ? (
                  <CheckCircle size={14} className="text-bl" />
                ) : (
                  <UserX size={14} className="text-rd" />
                )}

                <Switch
                  className="h-4 w-8 [&>span]:h-3 [&>span]:w-3"
                  checked={user.status}
                  onCheckedChange={(checked) =>
                    user.id && handleStatusChange(user.id, checked)
                  }
                  disabled={!isAdmin}
                />
              </div>
            </TableCell>
            <TableCell className="w-100">
              <div className="flex items-center">
                {user.accessList?.map((route, idx) => (
                  <span key={idx} className="mx-1">
                    {route.toUpperCase()}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell className="w-12 md:px-4">
              <div className="flex justify-center gap-8">
                <LinkEditButton url={`/${CREATE_USER_MAIN_ROUTE}/${user.id}`} />
                <DeleteButton
                  dialogText="confirmDelete"
                  descriptionText={user.mail}
                  onDelete={() => deleteUser(user.id as string)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
