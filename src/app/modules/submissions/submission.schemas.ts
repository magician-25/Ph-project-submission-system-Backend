import { z } from "zod";

export const createSubmissionSchema = z.object({
	assignmentId: z.uuid("Assignment ID must be a valid UUID"),
	userInput: z
		.string("Submission input must be text")
		.trim()
		.min(1, "Submission input is required")
		.max(10000, "Submission input cannot exceed 10,000 characters"),
});

export const reviewSubmissionSchema = z.object({
	status: z.enum(["APPROVED", "REJECTED"], {
		error: "Review status must be APPROVED or REJECTED",
	}),
	reviewNote: z
		.string({ error: "Review note must be text" })
		.trim()
		.max(2000, "Review note cannot exceed 2,000 characters")
		.optional(),
});

export const submissionIdParamsSchema = z.object({
	id: z.uuid("Submission ID must be a valid UUID"),
});

export type SubmissionIdParams = z.infer<typeof submissionIdParamsSchema>;
export type CreateSubmissionPayload = z.infer<typeof createSubmissionSchema>;
export type ReviewSubmissionPayload = z.infer<typeof reviewSubmissionSchema>;
