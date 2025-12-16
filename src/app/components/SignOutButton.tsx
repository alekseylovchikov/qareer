"use client";

import { LogOut } from "lucide-react";
import { db } from "@/lib/instant";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await db.auth.signOut();
    router.refresh();
  }

  return (
    <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
      <button
        onClick={handleSignOut}
        className="flex w-full items-center px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 rounded-md transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      >
        <LogOut className="mr-3 h-4 w-4" />
        Log out
      </button>
    </div>
  );
}
