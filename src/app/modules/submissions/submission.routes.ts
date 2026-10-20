import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth";
import { submissionRateLimit } from "../../middleware/rate-limit";
import {
	createSubmissionController,
	getMySubmissionController,
	listSubmissionsController,
	reviewSubmissionController,
	submissionStatsController,
} from "./submission.controller";

const submissionRouter = Router();

submissionRouter.post(
	"/",
	authenticate,
	requireRoles("STUDENT"),
	submissionRateLimit,
	createSubmissionController,
);
submissionRouter.get(
	"/mine",
	authenticate,
	requireRoles("STUDENT"),
	getMySubmissionController,
);
submissionRouter.get(
	"/",
	authenticate,
	requireRoles("MENTOR", "ADMIN"),
	listSubmissionsController,
);
submissionRouter.get(
	"/stats",
	authenticate,
	requireRoles("MENTOR", "ADMIN"),
	submissionStatsController,
);
submissionRouter.patch(
	"/:id/review",
	authenticate,
	requireRoles("MENTOR", "ADMIN"),
	reviewSubmissionController,
);

export default submissionRouter;
