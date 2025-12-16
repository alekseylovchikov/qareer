"use client";

import { db } from "@/lib/instant";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { id } from "@instantdb/react";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = db.useAuth();
  const { data, isLoading: dataLoading } = db.useQuery({
    profiles: {
      $: {
        where: { userId: user?.id },
      },
    },
  });

  const profile = data?.profiles?.[0] || {};

  if (authLoading || dataLoading)
    return <div className="p-8">Loading profile...</div>;

  function handleUpdateProfile(formData: FormData) {
    if (!user) return;
    const name = formData.get("name") as string;
    const title = formData.get("title") as string;
    const email = formData.get("email") as string; // We might not want to update auth email here easily, but can store in profile for display
    const summary = formData.get("summary") as string;

    const profileId = data?.profiles?.[0]?.id || id();

    db.transact(
      db.tx.profiles[profileId].update({
        name,
        title,
        summary,
        userId: user.id,
      })
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Profile
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Manage your public profile and professional details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleUpdateProfile} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                name="name"
                label="Full Name"
                defaultValue={profile.name || ""}
                placeholder="e.g. John Doe"
              />
              <Input
                name="title"
                label="Job Title"
                defaultValue={profile.title || ""}
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>

            <Input
              name="email"
              label="Email Address" // Assuming email is editable for this stub
              defaultValue={user?.email || ""}
              placeholder="john@example.com"
              disabled // Keep read-only relative to auth usually
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Professional Summary
              </label>
              <textarea
                name="summary"
                rows={4}
                className="flex w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                defaultValue={profile.summary || ""}
                placeholder="Briefly describe your experience and goals..."
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Resume Section Placeholder - in a real app this would be a file upload or rich editor */}
      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Resume upload functionality coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
