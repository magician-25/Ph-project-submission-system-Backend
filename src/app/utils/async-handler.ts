import type { RequestHandler } from "express";

export const asyncHandler =
	(handler: RequestHandler): RequestHandler =>
	async (request, response, next) => {
		try {
			await handler(request, response, next);
		} catch (error) {
			next(error);
		}
	};
