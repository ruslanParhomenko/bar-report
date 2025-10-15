"use client";
import { useApi } from "@/hooks/useApi";
import {
  EMPLOYEES_FIREBOX_ENDPOINT,
  USERS_FIREBOX_ENDPOINT,
} from "@/constants/endpoint-tag";
import { WrapperAccordionTable } from "../info/WrapperAccardionTable";
import { UsersTable } from "../../components/table/UsersTable";
import AddUsersForm from "./AddUsersForm";
import { EmployeesSchemaTypeData, UsersSchemaTypeData } from "./schema";
import AddEmployeesForm from "./AddEmployees";
import { EmployeesTable } from "@/components/table/EmployeesTable";

export default function SettingsPage() {
  // users
  const { deleteMutation: deleteUser } = useApi<any>({
    endpoint: USERS_FIREBOX_ENDPOINT,
    queryKey: USERS_FIREBOX_ENDPOINT,
    fetchInit: false,
  });
  const { query: queryUser } = useApi<UsersSchemaTypeData>({
    endpoint: USERS_FIREBOX_ENDPOINT,
    queryKey: USERS_FIREBOX_ENDPOINT,
    fetchInit: true,
  });
  // employees
  const { deleteMutation: deleteEmployee } = useApi<any>({
    endpoint: EMPLOYEES_FIREBOX_ENDPOINT,
    queryKey: EMPLOYEES_FIREBOX_ENDPOINT,
    fetchInit: false,
  });
  const { query: queryEmployee } = useApi<EmployeesSchemaTypeData>({
    endpoint: EMPLOYEES_FIREBOX_ENDPOINT,
    queryKey: EMPLOYEES_FIREBOX_ENDPOINT,
    fetchInit: true,
  });
  const { data: users, isLoading: isLoadingUsers } = queryUser;
  const { data: employees, isLoading: isLoadingEmployees } = queryEmployee;

  return (
    <>
      <WrapperAccordionTable nameTag="users" className="md:px-12">
        <AddUsersForm />
        {!isLoadingUsers && (
          <UsersTable
            data={users as UsersSchemaTypeData[]}
            remove={deleteUser.mutateAsync}
          />
        )}
      </WrapperAccordionTable>
      <WrapperAccordionTable nameTag="employees" className="md:flex-row">
        <div className="grid grid-cols-1 md:grid-cols-[30%_68%] w-full pt-4 md:gap-4">
          <AddEmployeesForm />
          {!isLoadingEmployees && (
            <EmployeesTable
              data={employees as EmployeesSchemaTypeData[]}
              remove={deleteEmployee.mutateAsync}
            />
          )}
        </div>
      </WrapperAccordionTable>
    </>
  );
}
