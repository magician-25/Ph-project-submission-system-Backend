/** biome-ignore-all lint/style/noNonNullAssertion: <no need for this file> */
import path from "node:path";
import { env } from "node:process";
import dotenv from "dotenv";

const envPath = path.join(process.cwd(), "/.env");

dotenv.config({ path: envPath, quiet: true });

export default {
	environment: env.ENVIRONMENT,
	port: env.PORT!,
	frontend_url: env.FRONTEND_URL || "http://localhost:3000",
	database_url: env.DATABASE_URL!,
	jwt_secret: env.JWT_SECRET!,
	bcrypt_salt_rounds: env.BCRYPT_SALT_ROUNDS!,
};
