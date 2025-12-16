"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/instant";
import { Button } from "@/app/components/ui/Button";

interface JobNotesProps {
  jobId: string;
  initialNotes: string | null;
}

export function JobNotes({ jobId, initialNotes }: JobNotesProps) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(initialNotes || "");
  }, [initialNotes]);

  async function handleSave() {
    setIsSaving(true);
    try {
      db.transact(db.tx.jobs[jobId].update({ notes }));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save notes", error);
    } finally {
      setIsSaving(false);
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full min-h-[150px] rounded-lg border border-zinc-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          placeholder="Jot down your thoughts here..."
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setNotes(initialNotes || "");
              setIsEditing(false);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Notes"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div
        onClick={() => setIsEditing(true)}
        className="min-h-[100px] cursor-text rounded-lg border border-transparent p-3 hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/50 transition-all"
      >
        {notes ? (
          <p className="whitespace-pre-wrap text-sm text-zinc-900 dark:text-zinc-50">
            {notes}
          </p>
        ) : (
          <p className="text-sm text-zinc-500 italic">
            No notes yet. Click to add...
          </p>
        )}
      </div>
    </div>
  );
}
