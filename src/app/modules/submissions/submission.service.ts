import status from "http-status";
import { prisma } from "../../lib/prisma";
import type { IQuery } from "../../types";
import { AppError } from "../../utils/app-error";
import type {
	CreateSubmissionPayload,
	ReviewSubmissionPayload,
} from "./submission.schemas";

const createSubmission = async (
	studentId: string,
	batchId: string | null,
	input: CreateSubmissionPayload,
) => {
	if (!batchId) {
		throw new AppError(400, "Your account is not assigned to a batch");
	}

	const assignment = await prisma.assignment.findFirst({
		where: {
			id: input.assignmentId,
			batch_id: batchId,
			released_at: { not: null },
		},
		select: { id: true, status: true },
	});
	if (!assignment) {
		throw new AppError(404, "Released assignment not found in your batch");
	}
	if (assignment.status !== "RELEASED") {
		throw new AppError(status.BAD_REQUEST, "Assignment is not released yet");
	}

	return prisma.submission.create({
		data: {
			assignment_id: assignment.id,
			student_id: studentId,
			user_input: input.userInput,
		},
	});
};

const getStudentSubmissions = (studentId: string) =>
	prisma.submission.findMany({
		where: { student_id: studentId },
		include: { assignment: true },
		orderBy: { created_at: "desc" },
	});

const getSubmissionsForReview = async (query: IQuery) => {
	const page = Math.max(1, Number.parseInt(query.page ?? "", 10) || 1);
	const limit = Math.min(
		100,
		Math.max(1, Number.parseInt(query.limit ?? "", 10) || 10),
	);

	const where = query.status
		? { status: query.status }
		: {};
	const [total, submissions] = await prisma.$transaction([
		prisma.submission.count({ where }),
		prisma.submission.findMany({
			where,
			include: {
				student: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				reviewer: { select: { id: true, name: true, email: true } },
				assignment: {
					select: {
						assignment_number: true,
						assignment_repo_url: true,
						requirement_doc_url: true,
						status: true,
						batch: {
							select: {
								name: true,
								code: true
							}
						}
					}
				},
			},
			orderBy: { created_at: "desc" },
			skip: (page - 1) * limit,
			take: limit,
		}),
	]);

	return {
		submissions,
		meta: {
			page,
			limit,
			dataCount: total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getSubmissionStatistics = async () => {
	const [total, pending, approved, rejected] = await Promise.all([
		prisma.submission.count(),
		prisma.submission.count({ where: { status: "PENDING" } }),
		prisma.submission.count({ where: { status: "APPROVED" } }),
		prisma.submission.count({ where: { status: "REJECTED" } }),
	]);
	return { total, pending, approved, rejected };
};

const reviewSubmission = async (
	submissionId: string,
	reviewerId: string,
	input: ReviewSubmissionPayload,
) => {
	const submission = await prisma.submission.findUnique({
		where: { id: submissionId },
		select: { id: true, status: true },
	});
	if (!submission) {
		throw new AppError(404, "Submission not found");
	}
	if (submission.status !== "PENDING") {
		throw new AppError(409, "Only pending submissions can be reviewed");
	}

	const updated = await prisma.submission.update({
		where: { id: submissionId, status: "PENDING" },
		data: {
			status: input.status,
			...(input.reviewNote !== undefined
				? { review_note: input.reviewNote }
				: {}),
			reviewer_id: reviewerId,
			reviewed_at: new Date(),
		},
	});

	return updated
};

export const SubmissionService = {
	createSubmission,
	getStudentSubmissions,
	getSubmissionsForReview,
	getSubmissionStatistics,
	reviewSubmission,
};
