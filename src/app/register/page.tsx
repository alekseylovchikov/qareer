"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();

  // Instant DB unifies login/register via Magic Codes.
  // We can just redirect to the login page.
  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <p>Redirecting to sign in...</p>
    </div>
  );
}
