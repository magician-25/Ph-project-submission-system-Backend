import type { RequestHandler } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { createBatchSchema } from "./batch.schemas";
import { createBatch, listBatches } from "./batch.service";

export const createBatchController: RequestHandler = asyncHandler(
	async (request, response) => {
		const input = createBatchSchema.parse(request.body);
		const batch = await createBatch(input);
		response.status(201).json({ success: true, data: batch });
	},
);

export const listBatchesController: RequestHandler = asyncHandler(
	async (_request, response) => {
		const batches = await listBatches();
		response.status(200).json({ success: true, data: batches });
	},
);
