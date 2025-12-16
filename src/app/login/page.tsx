"use client";

import { db } from "@/lib/instant";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await db.auth.sendMagicCode({ email });
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send code");
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await db.auth.signInWithMagicCode({ email, code });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to verify code");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 section-padding">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg dark:bg-zinc-950 dark:border dark:border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {sent ? "Check your email" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {sent ? `We sent a code to ${email}` : "Sign in with your email"}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSendCode} className="mt-8 space-y-6">
            <div className="space-y-4">
              <Input
                type="email"
                required
                placeholder="Email address"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button className="w-full justify-center">Send Code</Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="mt-8 space-y-6">
            <div className="space-y-4">
              <Input
                type="text"
                required
                placeholder="123456"
                label="Magic Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <Button className="w-full justify-center">Verify Code</Button>
          </form>
        )}

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}
