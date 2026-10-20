import { Router } from "express";
import { auth } from "../../middleware/auth";
import validateSchema from "../../utils/validateSchema";
import { BatchController } from "./batch.controller";
import { createBatchSchema } from "./batch.schemas";

const router = Router();

router.get("/", BatchController.getAllBatches);
router.post(
	"/",
	auth("ADMIN"),
	validateSchema(createBatchSchema),
	BatchController.createBatch,
);

export const BatchRoutes = router;
