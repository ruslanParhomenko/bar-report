"use client";
import { useSession } from "next-auth/react";

export const useDataSupaBaseStaff = ({
  localStorageKey,
  apiKey,
}: {
  localStorageKey: string;
  apiKey: string;
}) => {
  const session = useSession();
  //   const sendRealTime = async (formData?: any) => {
  //     const store = localStorage.getItem(localStorageKey) || "{}";

  //     console.log("dataToSend", formData);
  //     if (!formData) return;
  //     try {
  //       const res = await fetch(`/api/${apiKey}`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           user_email: session?.data?.user?.email,
  //           form_data: formData,
  //         }),
  //       });

  //       const result = await res.json();
  //       if (result.error) console.error("Sync error:", result.error);
  //     } catch (err) {
  //       console.error("Request error:", err);
  //     }
  //   };

  const fetchRealTime = async () => {
    try {
      const res = await fetch(`/api/${apiKey}`);
      const allData = await res.json();

      console.log("Fetched SupaBase data:", allData);

      if (allData) {
        // localStorage.setItem(
        //   localStorageKey,
        //   JSON.stringify(resetData)
        // );
        return allData;
      }
      return null;
    } catch (err) {
      console.error("Error fetching SupaBase data:", err);
      return null;
    }
  };

  return { fetchRealTime };
};
