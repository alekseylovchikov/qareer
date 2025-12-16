import type { InstantRules } from "@instantdb/react";

const rules = {
  jobs: {
    allow: {
      view: "true",
      create: "auth.id == data.userId",
      update: "auth.id == data.userId",
      delete: "auth.id == data.userId",
    },
  },
  interviews: {
    allow: {
      view: "true",
      create: "auth.id == data.userId",
      update: "auth.id == data.userId",
      delete: "auth.id == data.userId",
    },
  },
  skills: {
    allow: {
      view: "true",
      create: "auth.id == data.userId",
      update: "auth.id == data.userId",
      delete: "auth.id == data.userId",
    },
  },
  learningGoals: {
    allow: {
      view: "true",
      create: "auth.id == data.userId",
      update: "auth.id == data.userId",
      delete: "auth.id == data.userId",
    },
  },
  profiles: {
    allow: {
      view: "true",
      create: "auth.id == data.userId",
      update: "auth.id == data.userId",
      delete: "auth.id == data.userId",
    },
  },
  $files: {
    allow: {
      view: "true",
      create: "auth.id != null", // Allow any authenticated user to upload
      delete: "auth.id != null", // Allow any authenticated user to delete
    },
  },
} satisfies InstantRules;

export default rules;
