/** biome-ignore-all lint/style/noNonNullAssertion: <no need for this file> */
import path from "node:path";
import { env } from "node:process";
import dotenv from "dotenv";

const envPath = path.join(process.cwd(), "/.env");

dotenv.config({ path: envPath, quiet: true });

const bcryptSaltRounds = Number(env.BCRYPT_SALT_ROUNDS ?? 12);
if (
	!Number.isInteger(bcryptSaltRounds) ||
	bcryptSaltRounds < 4 ||
	bcryptSaltRounds > 31
) {
	throw new Error("BCRYPT_SALT_ROUNDS must be an integer between 4 and 31");
}

export default {
	environment: env.ENVIRONMENT,
	port: env.PORT!,
	frontend_url: env.FRONTEND_URL || "http://localhost:3000",
	database_url: env.DATABASE_URL!,
	jwt_secret: env.JWT_SECRET!,
	bcrypt_salt_rounds: bcryptSaltRounds,
};
