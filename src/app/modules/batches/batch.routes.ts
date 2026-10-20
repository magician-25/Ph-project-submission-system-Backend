import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth";
import {
	createBatchController,
	listBatchesController,
} from "./batch.controller";

const batchRouter = Router();

batchRouter.get("/", listBatchesController);
batchRouter.post(
	"/",
	authenticate,
	requireRoles("ADMIN"),
	createBatchController,
);

export default batchRouter;
