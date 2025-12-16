"use client";

import { useState } from "react";
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

  const [isUploading, setIsUploading] = useState(false);

  const profile = data?.profiles?.[0];

  if (!profile) return <div className="p-8">No profile found</div>;

  if (authLoading || dataLoading)
    return <div className="p-8">Loading profile...</div>;

  function handleUpdateProfile(formData: FormData) {
    if (!user) return;
    const name = formData.get("name") as string;
    const title = formData.get("title") as string;
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

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Path: resumes/USER_ID/FILENAME
      const path = `resumes/${user.id}/${file.name}`;
      await db.storage.uploadFile(path, file);
      const url = await db.storage.getDownloadUrl(path);

      const profileId = data?.profiles?.[0]?.id || id();
      db.transact(
        db.tx.profiles[profileId].update({
          resumeUrl: url,
          resumeName: file.name,
          userId: user.id,
        })
      );
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function deleteResume() {
    if (!profile?.id) return;

    db.transact(
      db.tx.profiles[profile.id].update({ resumeUrl: null, resumeName: null })
    );
    // Ideally delete from storage too, but simple unlink is fine for now
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
              label="Email Address"
              defaultValue={user?.email || ""}
              placeholder="john@example.com"
              disabled
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

      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
            {profile.resumeUrl ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                  <span className="text-sm font-medium">
                    {profile.resumeName || "Resume.pdf"}
                  </span>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Download
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deleteResume}
                  className="text-red-500"
                >
                  Remove Resume
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Upload your resume (PDF)
                </p>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <span
                    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 cursor-pointer ${
                      isUploading ? "opacity-50" : ""
                    }`}
                  >
                    {isUploading ? "Uploading..." : "Select File"}
                  </span>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
