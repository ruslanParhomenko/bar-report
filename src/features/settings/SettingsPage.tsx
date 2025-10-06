"use client";
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { USERS_FIREBOX_ENDPOINT } from "@/constants/endpoint-tag";
import { WrapperAccordionTable } from "../info/WrapperAccardionTable";
import { UsersTable } from "../../components/table/UsersTable";
import AddUsersForm from "./AddUsersForm";
import { UsersSchemaTypeData } from "./schema";

export default function SettingsPage() {
  const { deleteMutation: deleteUser } = useApi<any>({
    endpoint: USERS_FIREBOX_ENDPOINT,
    queryKey: USERS_FIREBOX_ENDPOINT,
    fetchInit: false,
  });
  const { query } = useApi<UsersSchemaTypeData>({
    endpoint: USERS_FIREBOX_ENDPOINT,
    queryKey: USERS_FIREBOX_ENDPOINT,
    fetchInit: true,
  });
  const { data, isLoading } = query;

  return (
    <WrapperAccordionTable nameTag="users" className="md:px-12">
      <AddUsersForm />
      {!isLoading && (
        <UsersTable
          data={data as UsersSchemaTypeData[]}
          remove={deleteUser.mutateAsync}
        />
      )}
    </WrapperAccordionTable>
  );
}
