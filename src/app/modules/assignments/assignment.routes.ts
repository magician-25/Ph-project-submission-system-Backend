import { Router } from "express";
import { auth } from "../../middleware/auth";
import validateSchema from "../../utils/validateSchema";
import { AssignmentController } from "./assignment.controller";
import {
	assignmentIdParamsSchema,
	batchIdParamsSchema,
	createAssignmentSchema,
	updateAssignmentStatusSchema,
} from "./assignment.schemas";

const router = Router();

router.get(
	"/",
	auth("STUDENT", "MENTOR"),
	AssignmentController.getStudentAssignments,
);

router.get(
	"/admin/batches/:batchId",
	auth("ADMIN"),
	validateSchema(batchIdParamsSchema, "params"),
	AssignmentController.getAssignmentsForBatch,
);

router.get(
	"/batches/:batchId",
	auth("MENTOR"),
	validateSchema(batchIdParamsSchema, "params"),
	AssignmentController.getAssignmentsForBatch,
);

router.post(
	"/",
	auth("ADMIN"),
	validateSchema(createAssignmentSchema),
	AssignmentController.createAssignment,
);

router.patch(
	"/:assignmentId/status",
	auth("ADMIN"),
	validateSchema(assignmentIdParamsSchema, "params"),
	validateSchema(updateAssignmentStatusSchema),
	AssignmentController.updateAssignmentStatus,
);

export const AssignmentRoutes = router;
