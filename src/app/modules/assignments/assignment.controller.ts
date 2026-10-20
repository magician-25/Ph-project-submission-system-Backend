import type { RequestUser } from "../../types";
import { AppError } from "../../utils/app-error";
import { asyncHandler } from "../../utils/async-handler";
import sendResponse from "../../utils/sendResponse";
import { AssignmentService } from "./assignment.service";

const createAssignment = asyncHandler(async (req, res) => {
	const assignment = await AssignmentService.createAssignment(req.body);
	sendResponse(res, {
		message: "Assignment created",
		data: assignment,
	});
});

const releaseAssignment = asyncHandler(async (req, res) => {
	const assignmentId = req.params.id;
	if (typeof assignmentId !== "string" || !assignmentId) {
		throw new AppError(400, "A valid assignment id is required");
	}
	const assignment = await AssignmentService.releaseAssignment(assignmentId);
	sendResponse(res, {
		message: "Assignment released",
		data: assignment,
	});
});

const getReleasedAssignments = asyncHandler(async (req, res) => {
	const user = req.user as RequestUser;
	const assignments = await AssignmentService.getReleasedAssignments(
		user.batch_id,
	);
	sendResponse(res, {
		message: "Released assignments retrieved",
		data: assignments,
	});
});

export const AssignmentController = {
	getReleasedAssignments,
	releaseAssignment,
	createAssignment
};
