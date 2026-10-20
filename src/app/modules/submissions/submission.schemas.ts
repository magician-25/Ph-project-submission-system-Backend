import { z } from "zod";

export const createSubmissionSchema = z.object({
	assignmentId: z.string().uuid(),
	userInput: z.string().trim().min(1).max(10000),
});

export const listSubmissionsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export const reviewSubmissionSchema = z.object({
	status: z.enum(["APPROVED", "REJECTED"]),
	reviewNote: z.string().trim().max(2000).optional(),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
