import status from "http-status";
import type { IQuery, RequestUser } from "../../types";
import { asyncHandler } from "../../utils/async-handler";
import sendResponse from "../../utils/sendResponse";
import { setAccessTokenCookie } from "../../utils/setAccessToken";
import type { UserIdParams } from "./auth.schemas";
import { AuthService } from "./auth.service";

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

const getMe = asyncHandler(async (req, res) => {
	const user = req.user as RequestUser;

	const result = await AuthService.getMe(user);

	sendResponse(res, {
		message: "Profile retrieved",
		data: result,
	});
});

const getUsers = asyncHandler(async (req, res) => {
	const query = req.query as IQuery;
	const result = await AuthService.getUsers(query);
	sendResponse(res, {
		message: "Users retrieved",
		data: result.users,
		meta: result.meta,
	});
});

const promoteStudentToMentor = asyncHandler(async (_req, res) => {
	const params = res.locals.validatedParams as UserIdParams;
	const user = await AuthService.promoteStudentToMentor(params);
	sendResponse(res, {
		message: "User promoted to mentor",
		data: user,
	});
});

export const AuthController = {
	createStudentAccount,
	login,
	logout,
	getMe,
	getUsers,
	promoteStudentToMentor,
};
