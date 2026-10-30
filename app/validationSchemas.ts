import { z } from "zod";

export const issueSchema = z.object({
  title: z.string().min(1, "is required").max(225),
  description: z.string().min(1, "is required"),
});

export const editIssueSchema = issueSchema.extend({
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
});
