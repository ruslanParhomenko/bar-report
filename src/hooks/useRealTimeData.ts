"use client";
import { useSession } from "next-auth/react";
export const useDataSupaBase = ({
  localStorageKey,
  apiKey,
}: {
  localStorageKey: string;
  apiKey: string;
}) => {
  const fetchMail = {
    bar: ["cng.nv.rstrnt@gmail.com"],
    cucina: ["cng.nv.kitchen@gmail.com"],
  };
  const session = useSession();
  const sendRealTime = async (formData?: any) => {
    const dataToSend = localStorage.getItem(localStorageKey);
    if (!dataToSend) return;
    try {
      const res = await fetch(`/api/${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: session?.data?.user?.email,
          form_data: formData ? formData : JSON.parse(dataToSend),
        }),
      });

      const result = await res.json();
      if (result.error) console.error("Sync error:", result.error);
    } catch (err) {
      console.error("Request error:", err);
    }
  };

  const fetchRealTime = async () => {
    try {
      const res = await fetch(`/api/${apiKey}`);
      const allData = await res.json();
      const dataBar = allData
        .filter((item: any) => fetchMail.bar.includes(item.user_email))
        .map((item: any) => item.form_data);

      const dataCucina = allData
        .filter((item: any) => fetchMail.cucina.includes(item.user_email))
        .map((item: any) => item.form_data);
      const resetData = {
        bar: dataBar[0] || [],
        cucina: dataCucina[0] || [],
      };
      if (resetData) {
        localStorage.setItem(localStorageKey, JSON.stringify(resetData));
        return resetData;
      }
      return null;
    } catch (err) {
      console.error("Error fetching SupaBase data:", err);
      return null;
    }
  };

  const fetchRealTimeMeniuStaff = async () => {
    try {
      const res = await fetch(`/api/${apiKey}`);
      const allData = await res.json();

      if (allData) {
        return allData;
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  return { sendRealTime, fetchRealTime, fetchRealTimeMeniuStaff };
};
