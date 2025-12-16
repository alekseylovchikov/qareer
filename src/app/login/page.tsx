"use client";

import { authenticate } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 section-padding">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg dark:bg-zinc-950 dark:border dark:border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to your account
          </p>
        </div>
        <form action={dispatch} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
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
                autoComplete="current-password"
                required
                placeholder="Password"
                label="Password"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 dark:bg-zinc-800 dark:border-zinc-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          <div>
            <LoginButton />
          </div>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        </form>
        <div className="text-center text-sm">
          <p className="text-zinc-600 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full flex justify-center" aria-disabled={pending}>
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}
