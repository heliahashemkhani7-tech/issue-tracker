import { z } from "zod";

export const issueSchema = z.object({
  title: z.string().min(1, "is required").max(225),
  description: z.string().min(1, "is required"),
});

export const patchIssueSchema = z.object({
  title: z.string().min(1, "is required").max(225).optional(),
  description: z.string().min(1, "is required").max(65535).optional(),
  assignedToUserId: z
    .string()
    .min(1, "assignedToUserId is Required")
    .max(225)
    .optional()
    .nullable(),
});

export const editIssueSchema = issueSchema.extend({
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
});
