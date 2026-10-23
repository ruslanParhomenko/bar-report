"use client";

import { createContext, useContext, useState } from "react";

type ShowAnimationContextType = {
  isShow: boolean;
  setIsShow: (v: boolean) => void;
};

const ShowContext = createContext<ShowAnimationContextType | null>(null);

export default function ShowAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState(false);

  return (
    <ShowContext.Provider
      value={{
        isShow: state,
        setIsShow: setState,
      }}
    >
      {children}
    </ShowContext.Provider>
  );
}

export function useShowAnimation() {
  const ctx = useContext(ShowContext);

  if (!ctx) {
    throw new Error(
      "useShowAnimation must be used inside ShowAnimationProvider",
    );
  }

  return ctx;
}
