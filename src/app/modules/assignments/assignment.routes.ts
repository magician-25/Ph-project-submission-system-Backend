import { Router } from "express";
import { auth } from "../../middleware/auth";
import validateSchema from "../../utils/validateSchema";
import { AssignmentController } from "./assignment.controller";
import { createAssignmentSchema } from "./assignment.schemas";

const router = Router();

router.get("/", auth("STUDENT"), AssignmentController.getReleasedAssignments);

router.post(
	"/",
	auth("ADMIN"),
	validateSchema(createAssignmentSchema),
	AssignmentController.createAssignment,
);

router.patch(
	"/:id/release",
	auth("ADMIN"),
	AssignmentController.releaseAssignment,
);

export const AssignmentRoutes = router;
