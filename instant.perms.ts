import type { InstantRules } from "@instantdb/react";

const rules = {
  jobs: {
    allow: {
      view: "auth.id == data.userId",
      create: "auth.id == data.userId",
      update: "auth.id == data.userId",
      delete: "auth.id == data.userId",
    },
  },
  interviews: {
    allow: {
      view: "auth.id == data.userId",
      create: "auth.id == data.userId",
      update: "auth.id == data.userId",
      delete: "auth.id == data.userId",
    },
  },
  skills: {
    allow: {
      view: "auth.id == data.userId",
      create: "auth.id == data.userId",
      update: "auth.id == data.userId",
      delete: "auth.id == data.userId",
    },
  },
  learningGoals: {
    allow: {
      view: "auth.id == data.userId",
      create: "auth.id == data.userId",
      update: "auth.id == data.userId",
      delete: "auth.id == data.userId",
    },
  },
  profiles: {
    allow: {
      view: "auth.id == data.userId",
      create: "auth.id == data.userId",
      update: "auth.id == data.userId",
      delete: "auth.id == data.userId",
    },
  },
  $files: {
    allow: {
      view: "auth.id != null", // Only authenticated users can view files
      create: "auth.id != null",
      delete: "auth.id != null",
    },
  },
} satisfies InstantRules;

export default rules;
