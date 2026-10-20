import bcrypt from "bcryptjs";
import status from "http-status";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { signToken } from "../../utils/jwt";
import type { LoginPayload, SignupPayload } from "./auth.schemas";

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
	})

	return {
		accessToken
	};
};

export const AuthService = {
	createStudentAccount,
	login,
};
