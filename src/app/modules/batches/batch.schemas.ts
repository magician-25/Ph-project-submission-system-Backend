import { z } from "zod";

export const createBatchSchema = z.object({
	name: z.string().trim().min(2).max(100),
	code: z
		.string()
		.trim()
		.min(2)
		.max(32)
		.regex(/^[A-Za-z0-9-]+$/)
		.transform((code) => code.toUpperCase()),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
