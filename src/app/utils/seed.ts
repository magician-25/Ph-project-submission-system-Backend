import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const seedAdmin = async () => {
	const name = process.env.SEED_ADMIN_NAME;
	const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
	const password = process.env.SEED_ADMIN_PASSWORD;
	if (!name || !email || !password || password.length < 8) {
		throw new Error(
			"Set SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD (at least 8 characters)",
		);
	}

	const passwordHash = await bcrypt.hash(password, 12);
	await prisma.user.upsert({
		where: { email },
		create: { name, email, password: passwordHash, role: "ADMIN" },
		update: { role: "ADMIN" },
		select: { id: true },
	});
};

seedAdmin()
	.then(() => {
		console.log("Admin account is ready.");
	})
	.catch((error: unknown) => {
		console.error("Admin seed failed:", error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
