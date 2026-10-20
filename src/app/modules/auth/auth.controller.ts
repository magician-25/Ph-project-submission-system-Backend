import type { RequestHandler } from "express";
import config from "../../config";
import { asyncHandler } from "../../utils/async-handler";
import { loginSchema, signupSchema } from "./auth.schemas";
import { login, signup } from "./auth.service";

const setAccessTokenCookie = (
	response: Parameters<RequestHandler>[1],
	token: string,
) => {
	response.cookie("access_token", token, {
		httpOnly: true,
		secure: config.environment !== "development",
		sameSite: config.environment === "development" ? "lax" : "none",
		maxAge: 24 * 60 * 60 * 1000,
	});
};

export const signupController: RequestHandler = asyncHandler(
	async (request, response) => {
		const input = signupSchema.parse(request.body);
		const result = await signup(input);
		setAccessTokenCookie(response, result.token);
		response.status(201).json({ success: true, data: result });
	},
);

export const loginController: RequestHandler = asyncHandler(
	async (request, response) => {
		const input = loginSchema.parse(request.body);
		const result = await login(input);
		setAccessTokenCookie(response, result.token);
		response.status(200).json({ success: true, data: result });
	},
);
