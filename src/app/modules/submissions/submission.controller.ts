import type { RequestHandler } from "express";
import { getAuthenticatedUser } from "../../middleware/auth";
import { AppError } from "../../utils/app-error";
import { asyncHandler } from "../../utils/async-handler";
import {
	createSubmissionSchema,
	listSubmissionsQuerySchema,
	reviewSubmissionSchema,
} from "./submission.schemas";
import {
	createSubmission,
	getMySubmission,
	getSubmissionStats,
	listSubmissions,
	reviewSubmission,
} from "./submission.service";

export const createSubmissionController: RequestHandler = asyncHandler(
	async (request, response) => {
		const user = getAuthenticatedUser(request);
		const input = createSubmissionSchema.parse(request.body);
		const submission = await createSubmission(user.id, user.batch_id, input);
		response.status(201).json({ success: true, data: submission });
	},
);

export const getMySubmissionController: RequestHandler = asyncHandler(
	async (request, response) => {
		const user = getAuthenticatedUser(request);
		const submission = await getMySubmission(user.id);
		response.status(200).json({ success: true, data: submission });
	},
);

export const listSubmissionsController: RequestHandler = asyncHandler(
	async (request, response) => {
		const query = listSubmissionsQuerySchema.parse(request.query);
		const result = await listSubmissions({
			page: query.page,
			limit: query.limit,
			...(query.status ? { status: query.status } : {}),
		});
		response.status(200).json({ success: true, data: result });
	},
);

export const submissionStatsController: RequestHandler = asyncHandler(
	async (_request, response) => {
		const stats = await getSubmissionStats();
		response.status(200).json({ success: true, data: stats });
	},
);

export const reviewSubmissionController: RequestHandler = asyncHandler(
	async (request, response) => {
		const user = getAuthenticatedUser(request);
		const submissionId = request.params.id;
		if (typeof submissionId !== "string" || submissionId.length === 0) {
			throw new AppError(400, "A valid submission id is required");
		}
		const input = reviewSubmissionSchema.parse(request.body);
		const submission = await reviewSubmission(submissionId, user.id, input);
		response.status(200).json({ success: true, data: submission });
	},
);
