import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type { CreateBatchInput } from "./batch.schemas";

export const createBatch = async (input: CreateBatchInput) => {
	const existingBatch = await prisma.batch.findUnique({
		where: { code: input.code },
		select: { id: true },
	});
	if (existingBatch) {
		throw new AppError(409, "A batch with this code already exists");
	}

	return prisma.batch.create({ data: input });
};

export const listBatches = () =>
	prisma.batch.findMany({
		select: { id: true, name: true, code: true },
		orderBy: { name: "asc" },
	});
