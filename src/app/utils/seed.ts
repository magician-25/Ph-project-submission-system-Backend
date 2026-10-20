import "dotenv/config";
import bcrypt from "bcryptjs";
import config from "../config";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
	const name = process.env.SEED_ADMIN_NAME;
	const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
	const password = process.env.SEED_ADMIN_PASSWORD;
	if (!name || !email || !password || password.length < 8) {
		throw new Error(
			"Set SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD (at least 8 characters)",
		);
	}

	const existingAdmin = await prisma.user.findFirst({
		where: { role: "ADMIN" },
		select: { id: true },
	});
	if (existingAdmin) {
		console.log("Admin already exists");
		return;
	}

	const passwordHash = await bcrypt.hash(password, config.bcrypt_salt_rounds);
	await prisma.user.create({
		data: { email, name, password: passwordHash, role: "ADMIN" },
	});
	console.log("Admin created");
};
