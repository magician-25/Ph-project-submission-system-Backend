import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { signToken } from "../../utils/jwt";
import type { LoginInput, SignupInput } from "./auth.schemas";

const publicUserSelect = {
	id: true,
	name: true,
	email: true,
	role: true,
	batch_id: true,
	created_at: true,
} as const;

export const signup = async (input: SignupInput) => {
	const batch = await prisma.batch.findUnique({
		where: { id: input.batchId },
		select: { id: true },
	});
	if (!batch) {
		throw new AppError(404, "Batch not found");
	}

	const existingUser = await prisma.user.findUnique({
		where: { email: input.email },
		select: { id: true },
	});
	if (existingUser) {
		throw new AppError(409, "An account with this email already exists");
	}

	const passwordHash = await bcrypt.hash(input.password, 12);
	const user = await prisma.user.create({
		data: {
			name: input.name,
			email: input.email,
			password: passwordHash,
			batch_id: input.batchId,
		},
		select: publicUserSelect,
	});

	return { user, token: signToken({ id: user.id, role: user.role }) };
};

export const login = async (input: LoginInput) => {
	const user = await prisma.user.findUnique({
		where: { email: input.email },
	});
	if (!user || !(await bcrypt.compare(input.password, user.password))) {
		throw new AppError(401, "Invalid email or password");
	}

	const publicUser = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		batch_id: user.batch_id,
		created_at: user.created_at,
	};
	return {
		user: publicUser,
		token: signToken({ id: publicUser.id, role: publicUser.role }),
	};
};
