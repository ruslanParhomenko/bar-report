"use client";

import { useEffect, useState } from "react";

export function useHashParam(key: string) {
  const getValue = () => {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.hash.slice(1));
    return params.get(key);
  };

  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setValue(getValue());
    };

    // 👇 сразу читаем при монтировании
    update();

    // 👇 слушаем реальные изменения hash
    window.addEventListener("hashchange", update);

    return () => {
      window.removeEventListener("hashchange", update);
    };
  }, []);

  const setHash = (val: string) => {
    const params = new URLSearchParams(window.location.hash.slice(1));

    params.set(key, val);

    // 👇 ВАЖНО: используем hash, а не pushState
    window.location.hash = params.toString();
    // hashchange сам вызовет update → setValue
  };

  return [value, setHash] as const;
}
