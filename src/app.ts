import cors from "cors";
import express, { type Request, type Response } from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_request: Request, response: Response) => {
  response.status(200).json({
    success: true,
    message: "Project submission server is running",
  });
});

export default app;
