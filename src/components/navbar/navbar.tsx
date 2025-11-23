"use client";
import { useThemeStore } from "@/store/themeStore";
import {useAuthStore}  from "@/store/authStore";
import DarkModeSwitch from "./darkModeSwitch";
import initials from "@/utils/initials";
import { useEffect } from "react";

export default function Navbar() {
    const {user} = useAuthStore();
    const dark = useThemeStore((s) => s.dark);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", dark);
    }
  }, [dark]);
     return (
    <nav className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center justify-between">
      <div className="font-semibold">User Dashboard</div>
      <div className="flex items-center gap-4">
        <DarkModeSwitch />
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-bold">
              {initials(user.name)}
            </div>
            <span className="text-sm">{user.name}</span>
          </div>
        )}
      </div>
    </nav>
  );
}