import { z } from "zod";

const webUrlSchema = z.url("Enter a valid URL").refine((value) => {
	const protocol = new URL(value).protocol;
	return protocol === "http:" || protocol === "https:";
}, "URL must use HTTP or HTTPS");

export const createAssignmentSchema = z.object({
	title: z
		.string("Title must be text")
		.trim()
		.min(2, "Title must be at least 2 characters")
		.max(200, "Title cannot exceed 200 characters"),
	requirementDocUrl: webUrlSchema,
	assignmentRepoUrl: webUrlSchema,
	batchId: z.uuid("Batch ID must be a valid UUID"),
	assignmentNumber: z
		.number({ error: "Assignment number must be a number" })
		.int("Assignment number must be a whole number")
		.positive("Assignment number must be greater than zero"),
});

export const batchIdParamsSchema = z.object({
	batchId: z.uuid("Batch ID must be a valid UUID"),
});

export const assignmentIdParamsSchema = z.object({
	assignmentId: z.uuid("Assignment ID must be a valid UUID"),
});

export const updateAssignmentStatusSchema = z.object({
	status: z.enum(["PENDING", "RELEASED", "ENDED"], {
		error: "Status must be PENDING, RELEASED, or ENDED",
	}),
});

export type CreateAssignmentPayload = z.infer<typeof createAssignmentSchema>;
export type BatchIdParams = z.infer<typeof batchIdParamsSchema>;
export type AssignmentIdParams = z.infer<typeof assignmentIdParamsSchema>;
export type UpdateAssignmentStatusPayload = z.infer<
	typeof updateAssignmentStatusSchema
>;
