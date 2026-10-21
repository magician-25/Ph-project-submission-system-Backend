import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type { CreateBatchPayload } from "./batch.schemas";

const createBatch = async (input: CreateBatchPayload) => {
	const existingBatch = await prisma.batch.findUnique({
		where: { code: input.code },
		select: { id: true },
	});
	if (existingBatch) {
		throw new AppError(409, "A batch with this code already exists");
	}

	return prisma.batch.create({
		data: input,
		omit: {
			created_at: true,
			updated_at: true
		}
	});
};

const getAllBatches = () =>
	prisma.batch.findMany({
		select: { id: true, name: true, code: true },
		orderBy: { name: "asc" },
	});

export const BatchService = {
	createBatch,
	getAllBatches,
};
