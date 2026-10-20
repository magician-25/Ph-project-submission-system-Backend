import { z } from "zod";

export const createBatchSchema = z.object({
	name: z
		.string({ error: "Batch name must be text" })
		.trim()
		.min(2, "Batch name must be at least 2 characters")
		.max(100, "Batch name cannot exceed 100 characters"),
	code: z
		.string({ error: "Batch code must be text" })
		.trim()
		.min(2, "Batch code must be at least 2 characters")
		.max(32, "Batch code cannot exceed 32 characters")
		.regex(
			/^[A-Za-z0-9- ]+$/,
			"Batch code may only contain letters, numbers, spaces, and hyphens",
		)
		.transform((code) => code.toUpperCase()),
});

export type CreateBatchPayload = z.infer<typeof createBatchSchema>;
