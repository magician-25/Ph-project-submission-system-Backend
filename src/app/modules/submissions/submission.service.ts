import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type {
	CreateSubmissionInput,
	ReviewSubmissionInput,
} from "./submission.schemas";

export const createSubmission = async (
	studentId: string,
	batchId: string | null,
	input: CreateSubmissionInput,
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
		select: { id: true },
	});
	if (!assignment) {
		throw new AppError(404, "Released assignment not found in your batch");
	}

	return prisma.submission.create({
		data: {
			assignment_id: assignment.id,
			student_id: studentId,
			user_input: input.userInput,
		},
	});
};

export const getMySubmission = (studentId: string) =>
	prisma.submission.findMany({
		where: { student_id: studentId },
		include: { assignment: true },
		orderBy: { created_at: "desc" },
	});

export const listSubmissions = async ({
	page,
	limit,
	status,
}: {
	page: number;
	limit: number;
	status?: "PENDING" | "APPROVED" | "REJECTED";
}) => {
	const where = status ? { status } : {};
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
						batch: true,
					},
				},
				reviewer: { select: { id: true, name: true, email: true } },
				assignment: { include: { batch: true } },
			},
			orderBy: { created_at: "desc" },
			skip: (page - 1) * limit,
			take: limit,
		}),
	]);

	return {
		submissions,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

export const getSubmissionStats = async () => {
	const [total, pending, approved, rejected] = await Promise.all([
		prisma.submission.count(),
		prisma.submission.count({ where: { status: "PENDING" } }),
		prisma.submission.count({ where: { status: "APPROVED" } }),
		prisma.submission.count({ where: { status: "REJECTED" } }),
	]);
	return { total, pending, approved, rejected };
};

export const reviewSubmission = async (
	submissionId: string,
	reviewerId: string,
	input: ReviewSubmissionInput,
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

	const updated = await prisma.submission.updateMany({
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
	if (updated.count === 0) {
		throw new AppError(409, "This submission has already been reviewed");
	}

	return prisma.submission.findUniqueOrThrow({
		where: { id: submissionId },
		include: {
			student: { select: { id: true, name: true, email: true } },
			reviewer: { select: { id: true, name: true, email: true } },
			assignment: { include: { batch: true } },
		},
	});
};
