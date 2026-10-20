import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type { CreateAssignmentPayload } from "./assignment.schemas";

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

const releaseAssignment = async (assignmentId: string) => {
	const assignment = await prisma.assignment.findUnique({
		where: { id: assignmentId },
		select: { id: true, released_at: true },
	});
	if (!assignment) {
		throw new AppError(404, "Assignment not found");
	}
	if (assignment.released_at) {
		throw new AppError(409, "Assignment has already been released");
	}

	const releasedAt = new Date();
	const updated = await prisma.assignment.updateMany({
		where: { id: assignmentId, released_at: null },
		data: { released_at: releasedAt },
	});
	if (updated.count === 0) {
		throw new AppError(409, "Assignment has already been released");
	}

	return prisma.assignment.findUniqueOrThrow({
		where: { id: assignmentId },
		include: { batch: true },
	});
};

const getReleasedAssignments = (batchId: string | null) => {
	if (!batchId) {
		throw new AppError(400, "Your account is not assigned to a batch");
	}

	return prisma.assignment.findMany({
		where: { batch_id: batchId, released_at: { not: null } },
		orderBy: { assignment_number: "asc" },
	});
};

export const AssignmentService = {
	getReleasedAssignments,
	releaseAssignment,
	createAssignment
}