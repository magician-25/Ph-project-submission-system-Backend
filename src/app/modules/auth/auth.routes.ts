import { Router } from "express";
import { auth } from "../../middleware/auth";
import validateSchema from "../../utils/validateSchema";
import { AuthController } from "./auth.controller";
import { loginSchema, signupSchema } from "./auth.schemas";

const router = Router();

router.post(
    "/signup",
    validateSchema(signupSchema),
    AuthController.createStudentAccount,
);
router.post("/login", validateSchema(loginSchema), AuthController.login);

router.post("/logout", auth(), AuthController.logout);

export const AuthRoutes = router;
