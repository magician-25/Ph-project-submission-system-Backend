import { z } from "zod";

const webUrlSchema = z
	.url()
	.refine((value) => {
		const protocol = new URL(value).protocol;
		return protocol === "http:" || protocol === "https:";
	}, "URL must use HTTP or HTTPS");

export const createAssignmentSchema = z.object({
	title: z.string().trim().min(2).max(200),
	requirementDocUrl: webUrlSchema,
	assignmentRepoUrl: webUrlSchema.optional(),
	batchId: z.uuid(),
	assignmentNumber: z.number().int().positive(),
});

export type CreateAssignmentPayload = z.infer<typeof createAssignmentSchema>;
