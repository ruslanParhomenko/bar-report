"use client";

import DeleteButton from "@/components/buttons/delete-button";
import LinkEditButton from "@/components/buttons/link-edit-button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CREATE_USER_MAIN_ROUTE } from "@/constants/route-tag";
import { CheckCircle, UserX } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useState } from "react";
import { deleteUser } from "../actions/delete-user";
import { GetUserData } from "../actions/get-users";
import { updateUser } from "../actions/update-user";

export function UsersPage({
  isAdmin,
  users,
}: {
  isAdmin: boolean;
  users: GetUserData[];
}) {
  const filter = useSearchParams().get("tab");

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
      setLocalUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: !newStatus } : u)),
      );
    }
  };
  return (
    <Table className="mt-4 table-auto [&>tbody>tr]:text-xs">
      <TableBody>
        {localUsers
          ?.filter(
            (u) =>
              filter === "all" || u.role.toLowerCase().includes(filter ?? ""),
          )
          .map((user, idx) => (
            <TableRow key={user.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{user.mail}</TableCell>
              <TableCell className="text-center md:px-2">{user.role}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-6 pr-4">
                  <LinkEditButton
                    url={`/${CREATE_USER_MAIN_ROUTE}/${user.id}`}
                    disabled={!isAdmin}
                  />
                  <DeleteButton
                    dialogText="confirmDelete"
                    descriptionText={user.mail}
                    onDelete={() => deleteUser(user.id as string)}
                    disabled={!isAdmin}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-8">
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
              <TableCell className="max-w-[60dvw] min-w-50">
                <div className="flex items-start">
                  <span className="mr-2 shrink-0 text-[10px] text-red-600">
                    page:
                  </span>
                  <span className="text-[11px] wrap-break-word whitespace-normal">
                    {user.accessList?.join(", ")}
                  </span>
                </div>

                <div className="mt-1 flex items-start">
                  <span className="mr-2 shrink-0 text-[10px] text-red-600">
                    tabs:
                  </span>
                  <span className="text-[11px] wrap-break-word whitespace-normal">
                    {user.accessTabs?.join(", ")}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
