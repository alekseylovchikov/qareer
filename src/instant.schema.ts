// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    interviews: i.entity({
      date: i.string().optional(),
      notes: i.string().optional(),
      type: i.string().optional(),
      userId: i.string().optional(),
    }),
    jobs: i.entity({
      company: i.string().optional(),
      createdAt: i.string().optional(),
      notes: i.string().optional(),
      status: i.string().optional(),
      title: i.string().optional(),
      updatedAt: i.string().optional(),
      url: i.string().optional(),
      userId: i.string().optional(),
    }),
    skills: i.entity({
      currentLevel: i.string().optional(),
      name: i.string().optional(),
      priority: i.number().optional(),
      targetLevel: i.string().optional(),
      userId: i.string().optional(),
    }),
  },
  links: {
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
    jobsInterviews: {
      forward: {
        on: "jobs",
        has: "many",
        label: "interviews",
      },
      reverse: {
        on: "interviews",
        has: "one",
        label: "job",
      },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
