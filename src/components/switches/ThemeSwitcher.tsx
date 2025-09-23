"use client";

import { useTheme } from "next-themes";
import { Sun, MoonStars, Moon } from "phosphor-react";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="cursor-pointer w-full justify-start pl-2 items-center text-black"
    >
      {theme === "dark" ? (
        <Sun
          style={{ width: "18px", height: "18px" }}
          className="text-[#ffffff]"
        />
      ) : (
        <MoonStars
          style={{ width: "18px", height: "18px" }}
          className="text-bl"
        />
      )}
      Theme
    </Button>
  );
}
