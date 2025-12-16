"use client";

import Link from "next/link";
import { SignOutButton } from "./SignOutButton";
import { usePathname } from "next/navigation";
import { Briefcase, GraduationCap, User, LayoutDashboard } from "lucide-react";
import { db } from "@/lib/instant";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = db.useAuth();
  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/learning", label: "Learning", icon: GraduationCap },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
        <span className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
          JobTracker
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      {Boolean(user) && (
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <SignOutButton />
        </div>
      )}
    </div>
  );
}
