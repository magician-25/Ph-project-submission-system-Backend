import { z } from "zod";

export const createSubmissionSchema = z.object({
	assignmentId: z.uuid("Assignment ID must be a valid UUID"),
	userInput: z
		.string("Submission input must be text")
		.trim()
		.min(1, "Submission input is required")
		.max(10000, "Submission input cannot exceed 10,000 characters"),
});

export const reviewSubmissionSchema = z
	.object({
		status: z.enum(["APPROVED", "REJECTED"], {
			error: "Review status must be APPROVED or REJECTED",
		}),
		mark: z
			.number({ error: "Mark must be a number" })
			.int("Mark must be a whole number")
			.min(0, "Mark cannot be less than 0")
			.max(60, "Mark cannot exceed 60")
			.optional(),
		reviewNote: z
			.string({ error: "Review note must be text" })
			.trim()
			.max(2000, "Review note cannot exceed 2,000 characters")
			.optional(),
	})
	.refine(
		(review) => review.status !== "APPROVED" || review.mark !== undefined,
		{
			message: "A mark is required when approving a submission",
			path: ["mark"],
		},
	);

export const submissionIdParamsSchema = z.object({
	id: z.uuid("Submission ID must be a valid UUID"),
});

export type SubmissionIdParams = z.infer<typeof submissionIdParamsSchema>;
export type CreateSubmissionPayload = z.infer<typeof createSubmissionSchema>;
export type ReviewSubmissionPayload = z.infer<typeof reviewSubmissionSchema>;
