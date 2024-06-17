"use client"

import * as React from "react"
import { Moon, Sun } from "@/components/svg"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/utils/helpers"

type ThemeToggleProps = {
  className?: string
}
export default function ThemeToggle({className}: ThemeToggleProps) {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <>
      {mounted &&
        (currentTheme !== "light" ? (
          <Sun className={cn("h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90", className)}
            onClick={() => setTheme("light")}
            />          
        ) : (
          <Moon className={cn("h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100", className)}
            onClick={() => setTheme("dark")}
            />
        ))}
    </>
  );  
}
