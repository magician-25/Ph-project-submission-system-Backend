import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { asyncHandler } from "./async-handler";

type ValidationSource = "body" | "query" | "params";

const validateSchema = (
	schema: ZodType,
	source: ValidationSource = "body",
): RequestHandler =>
	asyncHandler((request, response, next) => {
		const result = schema.parse(request[source]);

		if (source === "body") {
			request.body = result;
		} else {
			const localsKey = source === "query" ? "validatedQuery" : "validatedParams";
			response.locals[localsKey] = result;
		}

		next();
	});

export default validateSchema;
