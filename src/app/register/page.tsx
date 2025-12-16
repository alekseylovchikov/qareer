"use client";

import { register } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const [state, dispatch] = useActionState(register, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state === "success") {
      router.push("/login"); // Or directly sign in? Logic in action returned string.
    }
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 section-padding">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg dark:bg-zinc-950 dark:border dark:border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Start tracking your dream job
          </p>
        </div>
        <form action={dispatch} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Full Name"
                label="Full Name"
              />
            </div>
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                label="Email"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Password"
                label="Password"
              />
            </div>
          </div>

          <div>
            <RegisterButton />
          </div>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {state && state !== "success" && (
              <p className="text-sm text-red-500">{state}</p>
            )}
          </div>
        </form>
        <div className="text-center text-sm">
          <p className="text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full flex justify-center" aria-disabled={pending}>
      {pending ? "Creating account..." : "Sign up"}
    </Button>
  );
}
