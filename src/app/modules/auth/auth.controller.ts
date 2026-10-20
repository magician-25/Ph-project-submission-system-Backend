import type { Response } from "express";
import status from "http-status";
import config from "../../config";
import { asyncHandler } from "../../utils/async-handler";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const setAccessTokenCookie = (response: Response, token: string) => {
	response.cookie("access_token", token, {
		httpOnly: true,
		secure: config.environment !== "development",
		sameSite: config.environment === "development" ? "lax" : "none",
		maxAge: 24 * 60 * 60 * 1000,
	});
};

const createStudentAccount = asyncHandler(async (req, res) => {
	const result = await AuthService.createStudentAccount(req.body);
	setAccessTokenCookie(res, result.accessToken);
	sendResponse(res, {
		status: status.CREATED,
		message: "Student account created",
		data: result,
	});
});

const login = asyncHandler(async (req, res) => {
	const result = await AuthService.login(req.body);
	setAccessTokenCookie(res, result.accessToken);
	sendResponse(res, {
		message: "Login successful",
		data: result,
	});
});

const logout = asyncHandler(async (_req, res) => {
	res.clearCookie("access_token");

	sendResponse(res, {
		message: "Logout successful",
	});
});

export const AuthController = {
	createStudentAccount,
	login,
	logout
};
