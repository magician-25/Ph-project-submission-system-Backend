import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import config from "./app/config";
import { errorHandler, notFoundHandler } from "./app/middleware/error-handler";
import { apiRateLimit } from "./app/middleware/rate-limit";
import { AssignmentRoutes } from "./app/modules/assignments/assignment.routes";
import { AuthRoutes } from "./app/modules/auth/auth.routes";
import { BatchRoutes } from "./app/modules/batches/batch.routes";
import { SubmissionRoutes } from "./app/modules/submissions/submission.routes";

const app = express();

app.use(cors({ origin: config.frontend_url, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(apiRateLimit);

app.get("/", (_request, response) => {
	response.status(200).json({
		success: true,
		message: "Project submission server is running",
	});
});

app.use("/api/auth", AuthRoutes);
app.use("/api/submissions", SubmissionRoutes);
app.use("/api/assignments", AssignmentRoutes);
app.use("/api/batches", BatchRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
