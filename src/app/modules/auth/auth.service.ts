import bcrypt from "bcryptjs";
import status from "http-status";
import type { Role } from "../../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import type { IQuery, RequestUser } from "../../types";
import { AppError } from "../../utils/app-error";
import { signToken } from "../../utils/jwt";
import type { LoginPayload, SignupPayload, UserIdParams } from "./auth.schemas";

const createStudentAccount = async (payload: SignupPayload) => {
	const { email, batchId, name, password } = payload;
	const batch = await prisma.batch.findUnique({
		where: { id: payload.batchId },
		select: { id: true },
	});
	if (!batch) {
		throw new AppError(404, "Batch Not found");
	}

	const existingUser = await prisma.user.findUnique({
		where: { email },
		select: { id: true },
	});
	if (existingUser) {
		throw new AppError(409, "An account with this email already exists");
	}

	const passwordHash = await bcrypt.hash(password, config.bcrypt_salt_rounds);
	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: passwordHash,
			batch_id: batchId,
		},
	});

	const accessToken = signToken({
		id: user.id,
		email: user.email,
		role: user.role,
	});

	return {
		accessToken,
		role: user.role,
	};
};

const login = async (payload: LoginPayload) => {
	const { email, password } = payload;
	const user = await prisma.user.findUnique({
		where: { email },
	});
	if (!user) {
		throw new AppError(404, "No account found with this email");
	}

	const isCorrectPassword = await bcrypt.compare(password, user.password);
	if (!isCorrectPassword) {
		throw new AppError(status.BAD_REQUEST, "Invalid Credentials");
	}

	const accessToken = signToken({
		id: user.id,
		email: user.email,
		role: user.role,
	});

	return {
		accessToken,
		role: user.role,
	};
};

const getMe = async (user: RequestUser) => {
	const result = await prisma.user.findUnique({
		where: { email: user.email },
		omit: { password: true },
	});

	if (!result) {
		throw new AppError(status.NOT_FOUND, "No user found, please login");
	}

	return result;
};

const getUsers = async (query: IQuery) => {
	const page = Math.max(1, Number.parseInt(query.page ?? "", 10) || 1);
	const limit = Math.min(
		100,
		Math.max(1, Number.parseInt(query.limit ?? "", 10) || 10),
	);
	const roles: Role[] = ["STUDENT", "MENTOR", "ADMIN"];
	const roleValue =
		typeof query.role === "string" ? query.role.toUpperCase() : "";
	const role = roles.find((value) => value === roleValue);
	const search =
		typeof query.searchTerm === "string" ? query.searchTerm.trim() : "";
	const where = {
		...(role ? { role } : {}),
		...(search
			? {
				OR: [
					{ name: { contains: search, mode: "insensitive" as const } },
					{ email: { contains: search, mode: "insensitive" as const } },
				],
			}
			: {}),
	};
	const [dataCount, users] = await prisma.$transaction([
		prisma.user.count({ where }),
		prisma.user.findMany({
			where,
			omit: { password: true },
			orderBy: { created_at: "desc" },
			skip: (page - 1) * limit,
			take: limit,
		}),
	]);

	return {
		users,
		meta: {
			page,
			limit,
			dataCount,
			totalPages: Math.ceil(dataCount / limit),
		},
	};
};

const promoteStudentToMentor = async ({ userId }: UserIdParams) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { id: true, role: true },
	});
	if (!user) {
		throw new AppError(status.NOT_FOUND, "User not found");
	}
	if (user.role === "ADMIN") {
		throw new AppError(
			status.BAD_REQUEST,
			"Admin accounts cannot be changed to mentor",
		);
	}
	if (user.role === "MENTOR") {
		return prisma.user.findUniqueOrThrow({
			where: { id: userId },
			omit: { password: true },
		});
	}

	return prisma.user.update({
		where: { id: userId },
		data: { role: "MENTOR", batch_id: null, },
		omit: { password: true },
	});
};

export const AuthService = {
	createStudentAccount,
	login,
	getMe,
	getUsers,
	promoteStudentToMentor,
};
