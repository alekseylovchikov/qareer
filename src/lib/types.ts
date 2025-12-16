export const JobStatus = {
  SAVED: "SAVED",
  APPLIED: "APPLIED",
  INTERVIEWING: "INTERVIEWING",
  OFFER: "OFFER",
  REJECTED: "REJECTED",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];
