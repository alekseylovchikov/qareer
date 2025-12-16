"use client";

import { init, i } from "@instantdb/react";

// App ID provided by user
const APP_ID = "9dcbcd72-ce2b-4561-a5fa-24e7ae8f4a8d";

// Define Schema
// We infer schema from our usage, but defining it gives us type safety.
const schema = i.schema({
  entities: {
    jobs: i.entity({
      title: i.string(),
      company: i.string(),
      status: i.string(), // SAVED, APPLIED, INTERVIEWING, OFFER, REJECTED
      url: i.string().optional(),
      salary: i.string().optional(),
      description: i.string().optional(),
      notes: i.string().optional(),
      userId: i.string(),
      createdAt: i.string(),
      updatedAt: i.string(),
    }),
    interviews: i.entity({
      date: i.string(), // ISO string
      type: i.string(),
      notes: i.string().optional(),
      userId: i.string(), // Link to user for easier querying
    }),
    skills: i.entity({
      name: i.string(),
      currentLevel: i.string().optional(),
      targetLevel: i.string().optional(),
      priority: i.number(),
      userId: i.string(),
    }),
    learningGoals: i.entity({
      title: i.string(),
      isCompleted: i.boolean(),
      userId: i.string(),
    }),
    profiles: i.entity({
      name: i.string().optional(),
      title: i.string().optional(),
      summary: i.string().optional(),
      resumeUrl: i.string().optional(),
      resumeName: i.string().optional(),
      userId: i.string().unique(), // One profile per user
    }),
  },
  links: {
    jobInterviews: {
      forward: { on: "jobs", has: "many", label: "interviews" },
      reverse: { on: "interviews", has: "one", label: "job" },
    },
    skillGoals: {
      forward: { on: "skills", has: "many", label: "learningGoals" },
      reverse: { on: "learningGoals", has: "one", label: "skill" },
    },
  },
});

export const db = init({ appId: APP_ID, schema });
