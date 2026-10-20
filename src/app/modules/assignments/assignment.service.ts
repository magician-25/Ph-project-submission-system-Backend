import type { AssignmentStatus } from "../../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { IQuery } from "../../types";
import { AppError } from "../../utils/app-error";
import type {
	CreateAssignmentPayload,
	UpdateAssignmentStatusPayload,
} from "./assignment.schemas";

const createAssignment = async (input: CreateAssignmentPayload) => {
	const batch = await prisma.batch.findUnique({
		where: { id: input.batchId },
		select: { id: true },
	});
	if (!batch) {
		throw new AppError(404, "Batch not found");
	}

	return prisma.assignment.create({
		data: {
			title: input.title,
			requirement_doc_url: input.requirementDocUrl,
			...(input.assignmentRepoUrl
				? { assignment_repo_url: input.assignmentRepoUrl }
				: {}),
			assignment_number: input.assignmentNumber,
			batch_id: input.batchId,
		},
		include: { batch: true },
	});
};

const updateAssignmentStatus = async (
	assignmentId: string,
	input: UpdateAssignmentStatusPayload,
) => {
	const assignment = await prisma.assignment.findUnique({
		where: { id: assignmentId },
		select: { id: true, released_at: true },
	});
	if (!assignment) {
		throw new AppError(404, "Assignment not found");
	}

	const releasedAt =
		input.status === "RELEASED"
			? (assignment.released_at ?? new Date())
			: input.status === "PENDING"
				? null
				: assignment.released_at;

	return prisma.assignment.update({
		where: { id: assignmentId },
		data: { status: input.status, released_at: releasedAt },
		include: {
			batch: true,
		},
	});
};

const getReleasedAssignments = (batchId: string | null) => {
	if (!batchId) {
		throw new AppError(400, "Your account is not assigned to a batch");
	}

	return prisma.assignment.findMany({
		where: { batch_id: batchId, status: "RELEASED" },
		orderBy: { assignment_number: "asc" },
	});
};

const getAssignmentsForBatch = async (batchId: string, query: IQuery) => {
	if (!batchId) {
		throw new AppError(400, "A batch ID is required");
	}

	const batch = await prisma.batch.findUnique({
		where: { id: batchId },
		select: { id: true },
	});
	if (!batch) {
		throw new AppError(404, "Batch not found");
	}

	const page = Math.max(1, Number.parseInt(query.page ?? "", 10) || 1);
	const limit = Math.min(
		100,
		Math.max(1, Number.parseInt(query.limit ?? "", 10) || 10),
	);
	const assignmentStatuses: AssignmentStatus[] = [
		"PENDING",
		"RELEASED",
		"ENDED",
	];
	const requestedStatus =
		typeof query.status === "string" ? query.status.toUpperCase() : undefined;
	const assignmentStatus = assignmentStatuses.find(
		(value) => value === requestedStatus,
	);
	const where = {
		batch_id: batchId,
		...(assignmentStatus ? { status: assignmentStatus } : {}),
	};
	const [total, assignments] = await prisma.$transaction([
		prisma.assignment.count({ where }),
		prisma.assignment.findMany({
			where,
			include: { batch: true },
			orderBy: { assignment_number: "asc" },
			skip: (page - 1) * limit,
			take: limit,
		}),
	]);

	return {
		assignments,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

export const AssignmentService = {
	getReleasedAssignments,
	updateAssignmentStatus,
	createAssignment,
	getAssignmentsForBatch,
};
