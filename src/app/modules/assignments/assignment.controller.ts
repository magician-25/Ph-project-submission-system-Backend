import status from "http-status";
import type { IQuery, RequestUser } from "../../types";
import { asyncHandler } from "../../utils/async-handler";
import sendResponse from "../../utils/sendResponse";
import type {
	AssignmentIdParams,
	BatchIdParams,
	UpdateAssignmentStatusPayload,
} from "./assignment.schemas";
import { AssignmentService } from "./assignment.service";

const handleCreateAssignment = asyncHandler(async (req, res) => {
	const assignment = await AssignmentService.createAssignment(req.body);
	sendResponse(res, {
		status: status.CREATED,
		message: "Assignment created",
		data: assignment,
	});
});

const handleUpdateAssignmentStatus = asyncHandler(async (req, res) => {
	const { assignmentId } = res.locals.validatedParams as AssignmentIdParams;
	const assignment = await AssignmentService.updateAssignmentStatus(
		assignmentId,
		req.body as UpdateAssignmentStatusPayload,
	);
	sendResponse(res, {
		message: "Assignment status updated",
		data: assignment,
	});
});

const handleGetAssignmentsForBatch = asyncHandler(async (req, res) => {
	const { batchId } = res.locals.validatedParams as BatchIdParams;
	const query = req.query as IQuery;
	const result = await AssignmentService.getAssignmentsForBatch(batchId, query);
	sendResponse(res, {
		message: "Batch assignments retrieved",
		data: result.assignments,
		meta: {
			page: result.pagination.page,
			limit: result.pagination.limit,
			totalPages: result.pagination.totalPages,
			dataCount: result.pagination.total,
		},
	});
});

const handleGetStudentAssignments = asyncHandler(async (req, res) => {
	const user = req.user as RequestUser;
	const assignments = await AssignmentService.getStudentAssignments(
		user.batch_id,
		user.id,
	);
	sendResponse(res, {
		message: "Assignments retrieved",
		data: assignments,
	});
});

export const AssignmentController = {
	getStudentAssignments: handleGetStudentAssignments,
	updateAssignmentStatus: handleUpdateAssignmentStatus,
	createAssignment: handleCreateAssignment,
	getAssignmentsForBatch: handleGetAssignmentsForBatch,
};
