import app from "./app";
import { prisma } from "./app/lib/prisma";
import { seedAdmin } from "./app/utils/seed";

const port = Number(process.env.PORT ?? 5000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
	throw new Error("PORT must be an integer between 1 and 65535");
}

const startServer = async () => {
	try {
		await prisma.$connect();
		console.log("Connected to database successfully");

		await seedAdmin();
		app.listen(port, () => {
			console.log(`Server is running on port: ${port}`);
		});
	} catch (error) {
		console.error("Failed to start the server", error);
		await prisma.$disconnect();
		process.exitCode = 1;
	}
};

void startServer();
