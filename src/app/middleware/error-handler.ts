import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../../generated/prisma/client";
import { AppError } from "../utils/app-error";

export const notFoundHandler: RequestHandler = (request, response) => {
	response.status(404).json({
		success: false,
		message: "Route not found",
		path: request.originalUrl,
	});
};

export const errorHandler: ErrorRequestHandler = (
	error: unknown,
	_request,
	response,
	_next,
) => {
	let statusCode = 500;
	let message = "An unexpected server error occurred";
	let details: unknown;

	if (error instanceof AppError) {
		statusCode = error.statusCode;
		message = error.message;
	} else if (error instanceof ZodError) {
		statusCode = 400;
		message = "Request validation failed";
		details = error.issues.map((issue) => ({
			field: issue.path.join("."),
			message: issue.message,
		}));
	} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (error.code === "P2002") {
			statusCode = 409;
			message = "A record with this information already exists";
		} else if (error.code === "P2025") {
			statusCode = 404;
			message = "The requested record was not found";
		}
	}

	if (statusCode >= 500) {
		console.error("Request failed:", error);
	}

	response.status(statusCode).json({
		success: false,
		message,
		...(details ? { details } : {}),
	});
};
