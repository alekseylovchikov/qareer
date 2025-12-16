"use client";

import { signOutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <LogOut className="h-4 w-4" />
        <span className="truncate font-medium">Log out</span>
      </button>
    </form>
  );
}
