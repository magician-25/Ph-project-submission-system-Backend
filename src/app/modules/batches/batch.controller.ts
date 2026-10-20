import status from "http-status";
import { asyncHandler } from "../../utils/async-handler";
import sendResponse from "../../utils/sendResponse";
import { BatchService } from "./batch.service";

const handleCreateBatch = asyncHandler(async (req, res) => {
	const batch = await BatchService.createBatch(req.body);
	sendResponse(res, {
		status: status.CREATED,
		message: "Batch created",
		data: batch,
	});
});

const handleListBatches = asyncHandler(async (_req, res) => {
	const batches = await BatchService.getAllBatches();
	sendResponse(res, { message: "Batches retrieved", data: batches });
});

export const BatchController = {
	createBatch: handleCreateBatch,
	getAllBatches: handleListBatches,
};
