"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { UserData } from "@/app/actions/users/userAction";
import UsersActions from "./users-action";

export default function UsersPage({ users }: { users: UserData[] }) {
  return (
    <Table className="table-fixed">
      <TableBody>
        {users?.map((user, idx) => (
          <TableRow key={user.id}>
            <TableCell className="w-8">{idx + 1}</TableCell>
            <TableCell className="truncate w-50 md:w-80">{user.mail}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className="w-20 px-2">
              <UsersActions id={user.id as string} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
