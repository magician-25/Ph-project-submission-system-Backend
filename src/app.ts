import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import config from "./app/config";
import { errorHandler, notFoundHandler } from "./app/middleware/error-handler";
import { AssignmentRoutes } from "./app/modules/assignments/assignment.routes";
import authRouter from "./app/modules/auth/auth.routes";
import batchRouter from "./app/modules/batches/batch.routes";
import submissionRouter from "./app/modules/submissions/submission.routes";

const app = express();

app.use(cors({ origin: config.frontend_url, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Project submission server is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/submissions", submissionRouter);
app.use("/api/assignments", AssignmentRoutes);
app.use("/api/batches", batchRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
