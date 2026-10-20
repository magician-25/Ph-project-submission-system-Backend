import status from "http-status";
import type { RequestUser } from "../../types";
import { asyncHandler } from "../../utils/async-handler";
import sendResponse from "../../utils/sendResponse";
import { SubmissionService } from "./submission.service";

const handleCreateSubmission = asyncHandler(async (req, res) => {
	const student = req.user as RequestUser;
	const submission = await SubmissionService.createSubmission(
		student.id,
		student.batch_id,
		req.body,
	);
	sendResponse(res, {
		status: status.CREATED,
		message: "Submission created",
		data: submission,
	});
});

const handleGetMySubmissions = asyncHandler(async (req, res) => {
	const student = req.user as RequestUser;
	const submissions = await SubmissionService.getStudentSubmissions(student.id);
	sendResponse(res, {
		message: "Your submissions retrieved",
		data: submissions,
	});
});

const handleGetSubmissionsForReview = asyncHandler(async (req, res) => {
	const query = req.query;
	const { meta, submissions } = await SubmissionService.getSubmissionsForReview(query);
	sendResponse(res, {
		message: "Submissions retrieved",
		data: submissions,
		meta,
	});
});

const handleGetSubmissionStatistics = asyncHandler(async (_req, res) => {
	const statistics = await SubmissionService.getSubmissionStatistics();
	sendResponse(res, {
		message: "Submission statistics retrieved",
		data: statistics,
	});
});

const handleReviewSubmission = asyncHandler(async (req, res) => {
	const reviewer = req.user as RequestUser;
	const { id: submissionId } = res.locals.validatedParams;
	const submission = await SubmissionService.reviewSubmission(
		submissionId,
		reviewer.id,
		req.body,
	);
	sendResponse(res, {
		message: "Submission reviewed",
		data: submission,
	});
});

export const SubmissionController = {
	createSubmission: handleCreateSubmission,
	getMySubmissions: handleGetMySubmissions,
	getSubmissionsForReview: handleGetSubmissionsForReview,
	getSubmissionStatistics: handleGetSubmissionStatistics,
	reviewSubmission: handleReviewSubmission,
};
