import { z } from "zod";

export const issueSchema = z.object({
  title: z.string().min(1, "is required").max(225),
  description: z.string().min(1, "is required"),
});
