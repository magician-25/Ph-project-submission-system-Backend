import { Router } from "express";
import { authRateLimit } from "../../middleware/rate-limit";
import { loginController, signupController } from "./auth.controller";

const authRouter = Router();

authRouter.post("/signup", authRateLimit, signupController);
authRouter.post("/login", authRateLimit, loginController);

export default authRouter;
