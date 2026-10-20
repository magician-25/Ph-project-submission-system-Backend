import { Router } from "express";
import { auth } from "../../middleware/auth";
import validateSchema from "../../utils/validateSchema";
import { SubmissionController } from "./submission.controller";
import {
	createSubmissionSchema,
	reviewSubmissionSchema,
	submissionIdParamsSchema,
} from "./submission.schemas";

const router = Router();

router.post(
	"/",
	auth("STUDENT"),
	validateSchema(createSubmissionSchema),
	SubmissionController.createSubmission,
);
router.get("/mine", auth("STUDENT"), SubmissionController.getMySubmissions);

router.get(
	"/",
	auth("MENTOR", "ADMIN"),
	SubmissionController.getSubmissionsForReview,
);

router.get(
	"/stats",
	auth("MENTOR", "ADMIN"),
	SubmissionController.getSubmissionStatistics,
);

router.patch(
	"/:id/review",
	auth("MENTOR", "ADMIN"),
	validateSchema(submissionIdParamsSchema, "params"),
	validateSchema(reviewSubmissionSchema),
	SubmissionController.reviewSubmission,
);

export const SubmissionRoutes = router;
